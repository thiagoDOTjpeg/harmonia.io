import { SyncPlaylistJobData, SyncProgress, SyncResult } from '@harmonia/shared';
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
    const startTime = Date.now();
    const { data } = job;

    console.log(`[Worker] Iniciando sync da playlist ${data.playlistId}`);

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
      const googleClient = Container.getGoogleClient();

      const spotifyClient = new SpotifyMusicClient(
        data.spotifyAccessToken,
        data.spotifyUserId
      );

      const youtubePlaylistInfo = await googleClient.getPlaylistInfo(
        data.youtubePlaylistId,
        data.googleAccessToken
      );

      const youtubeVideos = await googleClient.getPlaylistItems(
        data.youtubePlaylistId,
        data.googleAccessToken
      );

      console.log(`[Worker] ${youtubeVideos.length} vídeos encontrados no YouTube`);

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

        console.log(`[Worker] Playlist criada no Spotify: ${spotifyPlaylistId}`);

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
        console.log(`[Worker] Playlist já existe, atualizando...`);
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
          console.log(`[Worker] Processando (${i + 1}/${youtubeVideos.length}): ${video.title}`);

          let track = await trackRepository.findByYoutubeVideoId(video.videoId);

          if (!track) {
            track = await trackRepository.create({
              youtubeVideoId: video.videoId,
              youtubeTitle: video.title,
              youtubeChannel: video.channelTitle,
            });
          }

          let spotifyMatch = null;
          if (!track.hasSpotifyMatch()) {
            spotifyMatch = await spotifyClient.searchTrack(video.title, video.videoOwnerChannelTitle);

            if (!spotifyMatch) {
              console.log(`[Worker] ❌ Falha no match: ${video.title}`);
              failedCount++;
              continue;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            console.log(
              `[Worker] ♻️  Reutilizando match: ${track.spotifyArtist} - ${track.spotifyTrackId}`
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
                console.log(
                  `[Worker] 🔄 Duplicata: Substituindo "${existingMatch.video.title}" (${existingMatch.video.channelTitle}) por "${video.title}" (${video.channelTitle})`
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
                console.log(
                  `[Worker] 🔄 Duplicata: Mantendo "${existingMatch.video.title}" (${existingMatch.video.channelTitle}), ignorando "${video.title}" (${video.channelTitle})`
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
              console.log(`[Worker] Track já existe na playlist: ${track.id}`);
            }
          }

          if (track.hasSpotifyMatch() && isNewInPlaylist) {
            syncedCount++;
          }
        } catch (error) {
          console.error(`[Worker] Erro ao processar ${video.videoId}:`, error);
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

        console.log(`[Worker] Adicionando ${uniqueTracksToAdd.length} músicas únicas no Spotify...`);

        await spotifyClient.addTracksToPlaylist(
          syncedPlaylist.spotifyPlaylistId,
          uniqueTracksToAdd
        );

        console.log(`[Worker] ✅ ${uniqueTracksToAdd.length} músicas adicionadas no Spotify`);
      } else {
        console.log(`[Worker] Nenhuma música nova para adicionar`);
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

      console.log(
        `[Worker] Concluído! ${syncedCount} sincronizadas | ${failedCount} falharam | ${duplicateCount} duplicatas removidas em ${duration}ms`
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
      console.error('[Worker] Erro crítico:', error);

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