import { IGoogleMusicClient } from "@/application/ports/google/IGoogleMusicClient";
import { ISpotifyMusicClient } from "@/application/ports/spotify/ISpotifyMusicClient";
import { MusicMatchingService } from "@/domain/services/MusicMatchingService";
import { ILogger } from "@/infrastructure/logger";
import { SyncPlaylistJobData } from "@/types/sync-job";
import { IPlaylistRepository } from "../../repositories/IPlaylistRepository";
import { IPlaylistTrackRepository } from "../../repositories/IPlaylistTrackRepository";
import { ITrackRepository } from "../../repositories/ITrackRepository";

export class SyncYouTubePlaylistToSpotifyUseCase {
  constructor(
    private readonly playlistRepository: IPlaylistRepository,
    private readonly trackRepository: ITrackRepository,
    private readonly playlistTrackRepository: IPlaylistTrackRepository,
    private readonly googleMusicClient: IGoogleMusicClient,
    private readonly spotifyMusicClient: ISpotifyMusicClient,
    private readonly logger: ILogger,
  ) { }

  async execute(data: SyncPlaylistJobData) {
    const startTime = Date.now();

    this.logger.info({ playlistId: data.playlistId, userId: data.userId }, 'Starting playlist sync');

    try {
      const youtubePlaylistInfo = await this.googleMusicClient.getPlaylistInfo(
        data.youtubePlaylistId,
        data.googleAccessToken
      );
      const youtubeVideos = await this.googleMusicClient.getPlaylistItems(
        data.youtubePlaylistId,
        data.googleAccessToken
      );

      this.logger.info({ videoCount: youtubeVideos.length }, 'YouTube videos fetched');

      let syncedPlaylist = await this.playlistRepository.findByYoutubePlaylistId(
        data.userId,
        data.youtubePlaylistId
      );

      if (!syncedPlaylist) {
        const spotifyPlaylistId = await this.spotifyMusicClient.createPlaylist(
          youtubePlaylistInfo.title, data.spotifyAccessToken, data.spotifyUserId,
          `Synced from YouTube • ${youtubePlaylistInfo.description || 'Harmonia.io'}`
        );

        this.logger.info({ spotifyPlaylistId }, 'Spotify playlist created');

        syncedPlaylist = await this.playlistRepository.create({
          userId: data.userId,
          youtubePlaylistId: data.youtubePlaylistId,
          youtubeUrl: `https://www.youtube.com/playlist?list=${data.youtubePlaylistId}`,
          youtubeTitle: youtubePlaylistInfo.title,
          spotifyPlaylistId,
          spotifyUrl: `https://open.spotify.com/playlist/${spotifyPlaylistId}`,
          spotifyTitle: youtubePlaylistInfo.title,
        });
      } else {
        this.logger.info({ playlistId: syncedPlaylist.id }, 'Playlist exists, updating');
      }

      const existingPlaylistTracks = await this.playlistTrackRepository.findByPlaylistId(
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

        try {
          this.logger.debug({ trackIndex: i + 1, totalTracks: youtubeVideos.length, videoTitle: video.title }, 'Processing track');

          let track = await this.trackRepository.findByYoutubeVideoId(video.videoId);

          if (!track) {
            track = await this.trackRepository.create({
              youtubeVideoId: video.videoId,
              youtubeTitle: video.title,
              youtubeChannel: video.videoOwnerChannelTitle,
            });
          }

          let spotifyMatch = null;
          if (!track.hasSpotifyMatch()) {
            spotifyMatch = await this.spotifyMusicClient.searchTrack(video.title, video.videoOwnerChannelTitle, data.spotifyAccessToken);

            if (!spotifyMatch) {
              this.logger.warn({ videoTitle: video.title, videoId: video.videoId }, 'Match failed');
              failedCount++;
              continue;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            this.logger.debug(
              { spotifyArtist: track.spotifyArtist, spotifyTrackId: track.spotifyTrackId },
              'Reusing existing match'
            );
          }

          const spotifyTrackId = spotifyMatch?.trackId || track.spotifyTrackId;

          if (spotifyTrackId) {
            const existingMatch = processedSpotifyTracks.get(spotifyTrackId);

            if (existingMatch) {
              const bestVideo = MusicMatchingService.selectBestVideo(existingMatch.video, {
                videoId: video.videoId,
                title: video.title,
                channelTitle: video.channelTitle,
              });

              if (bestVideo.videoId === video.videoId) {
                this.logger.debug(
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
                  track = await this.trackRepository.updateSpotifyMatch(track.id, {
                    spotifyTrackId: spotifyMatch.trackId,
                    spotifyUri: spotifyMatch.uri,
                    spotifyArtist: spotifyMatch.artist,
                    spotifyAlbum: spotifyMatch.album,
                    matchScore: spotifyMatch.matchScore,
                    matchSource: 'auto',
                  });
                }
              } else {
                this.logger.debug(
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
              track = await this.trackRepository.updateSpotifyMatch(track.id, {
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
              await this.playlistTrackRepository.create({
                playlistId: syncedPlaylist.id,
                trackId: track.id,
                position: i,
              });
              newTracksCount++;
            } catch (error: any) {
              if (!error.message?.includes('Unique constraint')) {
                throw error;
              }
              this.logger.debug({ trackId: track.id }, 'Track already exists in playlist');
            }
          }

          if (track.hasSpotifyMatch() && isNewInPlaylist) {
            syncedCount++;
          }
        } catch (error) {
          this.logger.error({ err: error, videoId: video.videoId }, 'Error processing video');
          failedCount++;
        }
      }

      const uniqueTracksToAdd = Array.from(processedSpotifyTracks.values())
        .filter((t) => !existingTrackIds.has(t.trackDbId))
        .map((t) => t.spotifyUri);

      if (uniqueTracksToAdd.length > 0) {
        this.logger.info({ tracksToAdd: uniqueTracksToAdd.length }, 'Adding unique tracks to Spotify');

        await this.spotifyMusicClient.addTracksToPlaylist(
          syncedPlaylist.spotifyPlaylistId,
          uniqueTracksToAdd,
          data.spotifyAccessToken,
          data.spotifyUserId
        );

        this.logger.info({ addedTracks: uniqueTracksToAdd.length }, 'Tracks added to Spotify');
      } else {
        this.logger.info('No new tracks to add');
      }

      const finalStatus =
        failedCount === 0
          ? 'completed'
          : failedCount === youtubeVideos.length
            ? 'failed'
            : 'partial';

      await this.playlistRepository.updateSyncStatus(syncedPlaylist.id, {
        status: finalStatus,
        lastSyncedAt: new Date(),
      });

      const duration = Date.now() - startTime;

      this.logger.info(
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
      this.logger.error({ err: error }, 'CRITICAL: Sync failed');

      throw error;
    }
  }
}