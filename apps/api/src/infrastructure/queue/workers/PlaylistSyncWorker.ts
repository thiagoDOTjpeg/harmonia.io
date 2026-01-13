import { RequestContext } from '@/infrastructure/context/RequestContext';
import { logger } from '@/infrastructure/logger';
import { SyncPlaylistJobData, SyncProgress, SyncResult } from '@/types/sync-job';
import { Job } from 'bull';
import { MusicMatchingService } from '../../../domain/services/MusicMatchingService';
import { Container } from '../../../main/container';
import { SpotifyMusicClient } from '../../client/SpotifyMusicClient';

export class PlaylistSyncWorker {
  private static selectBestVideo(
    video1: { videoId: string; title: string; channelTitle: string },
    video2: { videoId: string; title: string; channelTitle: string }
  ): { videoId: string; title: string; channelTitle: string } {
    const isVideo1Official = /(-\s*topic|vevo)$/i.test(video1.channelTitle);
    const isVideo2Official = /(-\s*topic|vevo)$/i.test(video2.channelTitle);

    if (isVideo1Official && !isVideo2Official) return video1;
    if (isVideo2Official && !isVideo1Official) return video2;

    const isVideo1Distributor = MusicMatchingService.isLikelyDistributor(video1.channelTitle);
    const isVideo2Distributor = MusicMatchingService.isLikelyDistributor(video2.channelTitle);

    if (!isVideo1Distributor && isVideo2Distributor) return video1;
    if (!isVideo2Distributor && isVideo1Distributor) return video2;

    return video1;
  }

  static async process(job: Job<SyncPlaylistJobData>): Promise<SyncResult> {
    return RequestContext.run(
      { requestId: job.id?.toString() || 'unknown', correlationId: job.id?.toString(), userId: job.data.userId },
      async () => {
        return PlaylistSyncWorker.executeSync(job);
      }
    );
  }

  private static async executeSync(job: Job<SyncPlaylistJobData>): Promise<SyncResult> {
    const startTime = Date.now();
    const { data } = job;

    logger.info({ playlistId: data.playlistId, userId: data.userId }, 'Starting playlist sync');

    try {
      await job.progress({
        status: 'fetching',
        currentTrack: 0,
        totalTracks: 0,
        syncedTracks: 0,
        failedTracks: 0,
      } as SyncProgress);

      const playlistRepository = Container.getPlaylistRepository();
      const trackRepository = Container.getTrackRepository();
      const playlistTrackRepository = Container.getPlaylistTrackRepository();
      const googleMusicClient = Container.getGoogleMusicClient();

      const spotifyClient = new SpotifyMusicClient(
        data.spotifyAccessToken,
        data.spotifyUserId
      );

      const youtubePlaylistInfo = await googleMusicClient.getPlaylistInfo(
        data.youtubePlaylistId,
        data.googleAccessToken
      );
      const youtubeVideos = await googleMusicClient.getPlaylistItems(
        data.youtubePlaylistId,
        data.googleAccessToken
      );

      logger.info({ videoCount: youtubeVideos.length }, 'YouTube videos fetched');

      await job.progress({
        status: 'matching',
        currentTrack: 0,
        totalTracks: youtubeVideos.length,
        syncedTracks: 0,
        failedTracks: 0,
      } as SyncProgress);

      let syncedPlaylist = await playlistRepository.findByYoutubePlaylistId(
        data.userId,
        data.youtubePlaylistId
      );

      if (!syncedPlaylist) {
        const spotifyPlaylistId = await spotifyClient.createPlaylist(
          youtubePlaylistInfo.title,
          `Synced from YouTube • ${youtubePlaylistInfo.description || 'Harmonia.io'}`
        );

        logger.info({ spotifyPlaylistId }, 'Spotify playlist created');

        syncedPlaylist = await playlistRepository.create({
          userId: data.userId,
          youtubePlaylistId: data.youtubePlaylistId,
          youtubeUrl: `https://www.youtube.com/playlist?list=${data.youtubePlaylistId}`,
          youtubeTitle: youtubePlaylistInfo.title,
          spotifyPlaylistId,
          spotifyUrl: `https://open.spotify.com/playlist/${spotifyPlaylistId}`,
          spotifyTitle: youtubePlaylistInfo.title,
        });
      } else {
        logger.info({ playlistId: syncedPlaylist.id }, 'Playlist exists, updating');
      }

      const existingPlaylistTracks = await playlistTrackRepository.findByPlaylistId(
        syncedPlaylist.id
      );
      const existingTrackIds = new Set(existingPlaylistTracks.map((pt) => pt.trackId));

      let syncedCount = 0;
      let failedCount = 0;
      let duplicateCount = 0;
      let newTracksCount = 0;

      const processedSpotifyTracks = new Map<
        string,
        {
          trackDbId: string;
          spotifyUri: string;
          video: { videoId: string; title: string; channelTitle: string };
        }
      >();

      for (let i = 0; i < youtubeVideos.length; i++) {
        const video = youtubeVideos[i];

        await job.progress({
          status: 'matching',
          currentTrack: i + 1,
          totalTracks: youtubeVideos.length,
          syncedTracks: syncedCount,
          failedTracks: failedCount,
          currentTrackTitle: video.title,
        } as SyncProgress);

        try {
          logger.debug({ trackIndex: i + 1, totalTracks: youtubeVideos.length, videoTitle: video.title }, 'Processing track');

          let track = await trackRepository.findByYoutubeVideoId(video.videoId);

          if (!track) {
            track = await trackRepository.create({
              youtubeVideoId: video.videoId,
              youtubeTitle: video.title,
              youtubeChannel: video.videoOwnerChannelTitle,
            });
          }

          let spotifyMatch = null;
          if (!track.hasSpotifyMatch()) {
            spotifyMatch = await spotifyClient.searchTrack(video.title, video.videoOwnerChannelTitle);

            if (!spotifyMatch) {
              logger.warn({ videoTitle: video.title, videoId: video.videoId }, 'Match failed');
              failedCount++;
              continue;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            logger.debug(
              { spotifyArtist: track.spotifyArtist, spotifyTrackId: track.spotifyTrackId },
              'Reusing existing match'
            );
          }

          const spotifyTrackId = spotifyMatch?.trackId || track.spotifyTrackId;

          if (spotifyTrackId) {
            const existingMatch = processedSpotifyTracks.get(spotifyTrackId);

            if (existingMatch) {
              const bestVideo = this.selectBestVideo(existingMatch.video, {
                videoId: video.videoId,
                title: video.title,
                channelTitle: video.channelTitle,
              });

              if (bestVideo.videoId === video.videoId) {
                logger.debug(
                  { oldVideo: existingMatch.video.title, newVideo: video.title, channel: video.channelTitle },
                  'Duplicate: replacing with better match'
                );

                processedSpotifyTracks.set(spotifyTrackId, {
                  trackDbId: track.id,
                  spotifyUri: spotifyMatch?.uri || track.spotifyUri!,
                  video: {
                    videoId: video.videoId,
                    title: video.title,
                    channelTitle: video.channelTitle,
                  },
                });

                if (spotifyMatch) {
                  track = await trackRepository.updateSpotifyMatch(track.id, {
                    spotifyTrackId: spotifyMatch.trackId,
                    spotifyUri: spotifyMatch.uri,
                    spotifyArtist: spotifyMatch.artist,
                    spotifyAlbum: spotifyMatch.album,
                    matchScore: spotifyMatch.matchScore,
                    matchSource: 'auto',
                  });
                }
              } else {
                logger.debug(
                  { keptVideo: existingMatch.video.title, ignoredVideo: video.title },
                  'Duplicate: keeping existing'
                );
              }

              duplicateCount++;
              continue;
            }

            processedSpotifyTracks.set(spotifyTrackId, {
              trackDbId: track.id,
              spotifyUri: spotifyMatch?.uri || track.spotifyUri!,
              video: {
                videoId: video.videoId,
                title: video.title,
                channelTitle: video.channelTitle,
              },
            });

            if (spotifyMatch) {
              track = await trackRepository.updateSpotifyMatch(track.id, {
                spotifyTrackId: spotifyMatch.trackId,
                spotifyUri: spotifyMatch.uri,
                spotifyArtist: spotifyMatch.artist,
                spotifyAlbum: spotifyMatch.album,
                matchScore: spotifyMatch.matchScore,
                matchSource: 'auto',
              });
            }
          }

          const isNewInPlaylist = !existingTrackIds.has(track.id);

          if (isNewInPlaylist) {
            try {
              await playlistTrackRepository.create({
                playlistId: syncedPlaylist.id,
                trackId: track.id,
                position: i,
              });
              newTracksCount++;
            } catch (error: any) {
              if (!error.message?.includes('Unique constraint')) {
                throw error;
              }
              logger.debug({ trackId: track.id }, 'Track already exists in playlist');
            }
          }

          if (track.hasSpotifyMatch() && isNewInPlaylist) {
            syncedCount++;
          }
        } catch (error) {
          logger.error({ err: error, videoId: video.videoId }, 'Error processing video');
          failedCount++;
        }
      }

      const uniqueTracksToAdd = Array.from(processedSpotifyTracks.values())
        .filter((t) => !existingTrackIds.has(t.trackDbId))
        .map((t) => t.spotifyUri);

      if (uniqueTracksToAdd.length > 0) {
        await job.progress({
          status: 'adding',
          currentTrack: youtubeVideos.length,
          totalTracks: youtubeVideos.length,
          syncedTracks: syncedCount,
          failedTracks: failedCount,
        } as SyncProgress);

        logger.info({ tracksToAdd: uniqueTracksToAdd.length }, 'Adding unique tracks to Spotify');

        await spotifyClient.addTracksToPlaylist(
          syncedPlaylist.spotifyPlaylistId,
          uniqueTracksToAdd
        );

        logger.info({ addedTracks: uniqueTracksToAdd.length }, 'Tracks added to Spotify');
      } else {
        logger.info('No new tracks to add');
      }

      const finalStatus =
        failedCount === 0
          ? 'completed'
          : failedCount === youtubeVideos.length
            ? 'failed'
            : 'partial';

      await playlistRepository.updateSyncStatus(syncedPlaylist.id, {
        status: finalStatus,
        lastSyncedAt: new Date(),
      });

      await job.progress({
        status: 'completed',
        currentTrack: youtubeVideos.length,
        totalTracks: youtubeVideos.length,
        syncedTracks: syncedCount,
        failedTracks: failedCount,
      } as SyncProgress);

      const duration = Date.now() - startTime;

      logger.info(
        { syncedTracks: syncedCount, failedTracks: failedCount, duplicates: duplicateCount, durationMs: duration },
        'Sync completed'
      );

      return {
        playlistId: syncedPlaylist.id,
        totalTracks: youtubeVideos.length,
        syncedTracks: syncedCount,
        failedTracks: failedCount,
        newTracks: newTracksCount,
        duplicates: duplicateCount,
        status: finalStatus,
        duration,
      };
    } catch (error) {
      logger.error({ err: error }, 'CRITICAL: Sync failed');

      await job.progress({
        status: 'failed',
        currentTrack: 0,
        totalTracks: 0,
        syncedTracks: 0,
        failedTracks: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as SyncProgress);

      throw error;
    }
  }
}