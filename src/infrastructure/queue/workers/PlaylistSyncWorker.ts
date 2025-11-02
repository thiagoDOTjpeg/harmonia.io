import { Job } from 'bull';
import { Container } from '../../../main/container';
import { SpotifyMusicClient } from '../../client/SpotifyMusicClient';
import { SyncPlaylistJobData, SyncProgress, SyncResult } from '../jobs/SyncPlaylistJob';

export class PlaylistSyncWorker {
  static async process(job: Job<SyncPlaylistJobData>): Promise<SyncResult> {
    const startTime = Date.now();
    const { data } = job;

    console.log(`[Worker] Iniciando sync da playlist ${data.playlistId}`);

    try {
      // 1. Atualizar progresso: Fetching
      await job.progress({
        status: 'fetching',
        currentTrack: 0,
        totalTracks: 0,
        syncedTracks: 0,
        failedTracks: 0,
      } as SyncProgress);

      // 2. Buscar repositórios
      const playlistRepository = Container.getPlaylistRepository();
      const trackRepository = Container.getTrackRepository();
      const playlistTrackRepository = Container.getPlaylistTrackRepository();
      const googleClient = Container.getGoogleClient();

      // 3. Criar cliente Spotify
      const spotifyClient = new SpotifyMusicClient(
        data.spotifyAccessToken,
        data.spotifyUserId
      );

      // 4. Buscar informações da playlist do YouTube
      const youtubePlaylistInfo = await googleClient.getPlaylistInfo(
        data.youtubePlaylistId,
        data.googleAccessToken
      );

      const youtubeVideos = await googleClient.getPlaylistItems(
        data.youtubePlaylistId,
        data.googleAccessToken
      );

      console.log(`[Worker] ${youtubeVideos.length} vídeos encontrados no YouTube`);

      // 5. Atualizar total de tracks
      await job.progress({
        status: 'matching',
        currentTrack: 0,
        totalTracks: youtubeVideos.length,
        syncedTracks: 0,
        failedTracks: 0,
      } as SyncProgress);

      // 6. Verificar se playlist já foi sincronizada
      let syncedPlaylist = await playlistRepository.findByYoutubePlaylistId(
        data.userId,
        data.youtubePlaylistId
      );

      if (!syncedPlaylist) {
        // Criar playlist no Spotify
        const spotifyPlaylistId = await spotifyClient.createPlaylist(
          youtubePlaylistInfo.title,
          `Synced from YouTube • ${youtubePlaylistInfo.description || 'Harmonia.io'}`
        );

        console.log(`[Worker] Playlist criada no Spotify: ${spotifyPlaylistId}`);

        // Salvar no banco
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

      // 7. Buscar tracks já existentes nesta playlist
      const existingPlaylistTracks = await playlistTrackRepository.findByPlaylistId(
        syncedPlaylist.id
      );
      const existingTrackIds = new Set(existingPlaylistTracks.map((pt) => pt.trackId));

      // 8. Processar cada vídeo
      let syncedCount = 0;
      let failedCount = 0;
      let newTracksCount = 0;
      const tracksToAdd: string[] = [];

      for (let i = 0; i < youtubeVideos.length; i++) {
        const video = youtubeVideos[i];

        // Atualizar progresso
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

          // Verificar se track já existe (cache/reutilização)
          let track = await trackRepository.findByYoutubeVideoId(video.videoId);

          if (!track) {
            // Criar nova track
            track = await trackRepository.create({
              youtubeVideoId: video.videoId,
              youtubeTitle: video.title,
              youtubeChannel: video.channelTitle,
            });
          }

          // Se não tem match no Spotify, buscar
          if (!track.hasSpotifyMatch()) {
            const spotifyMatch = await spotifyClient.searchTrack(video.title);

            if (spotifyMatch) {
              track = await trackRepository.updateSpotifyMatch(track.id, {
                spotifyTrackId: spotifyMatch.trackId,
                spotifyUri: spotifyMatch.uri,
                spotifyArtist: spotifyMatch.artist,
                spotifyAlbum: spotifyMatch.album,
                matchScore: spotifyMatch.matchScore,
                matchSource: 'auto',
              });
            } else {
              console.log(`[Worker] ❌ Falha no match: ${video.title}`);
            }

            // Rate limiting: Spotify aceita ~1 req/seg
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            console.log(
              `[Worker] ♻️  Reutilizando match: ${track.spotifyArtist} - ${track.spotifyTrackId}`
            );
          }

          // Verificar se já está nesta playlist
          const isNewInPlaylist = !existingTrackIds.has(track.id);

          if (isNewInPlaylist) {
            // Adicionar à join table
            try {
              await playlistTrackRepository.create({
                playlistId: syncedPlaylist.id,
                trackId: track.id,
                position: i,
              });
              newTracksCount++;
            } catch (error: any) {
              // Ignora erro de duplicata (race condition)
              if (!error.message?.includes('Unique constraint')) {
                throw error;
              }
              console.log(`[Worker] Track já existe na playlist: ${track.id}`);
            }
          }

          // Se tem match, adicionar à lista para o Spotify (somente se for nova)
          if (track.hasSpotifyMatch() && track.spotifyUri && isNewInPlaylist) {
            tracksToAdd.push(track.spotifyUri);
            syncedCount++;
          } else if (!track.hasSpotifyMatch()) {
            failedCount++;
          }
        } catch (error) {
          console.error(`[Worker] Erro ao processar ${video.videoId}:`, error);
          failedCount++;
        }
      }

      // 9. Adicionar tracks no Spotify (batch)
      if (tracksToAdd.length > 0) {
        await job.progress({
          status: 'adding',
          currentTrack: youtubeVideos.length,
          totalTracks: youtubeVideos.length,
          syncedTracks: syncedCount,
          failedTracks: failedCount,
        } as SyncProgress);

        console.log(`[Worker] Adicionando ${tracksToAdd.length} músicas novas no Spotify...`);

        await spotifyClient.addTracksToPlaylist(syncedPlaylist.spotifyPlaylistId, tracksToAdd);

        console.log(`[Worker] ✅ ${tracksToAdd.length} músicas adicionadas no Spotify`);
      } else {
        console.log(`[Worker] Nenhuma música nova para adicionar`);
      }

      // 10. Atualizar status da playlist
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

      // 11. Atualizar progresso final
      await job.progress({
        status: 'completed',
        currentTrack: youtubeVideos.length,
        totalTracks: youtubeVideos.length,
        syncedTracks: syncedCount,
        failedTracks: failedCount,
      } as SyncProgress);

      const duration = Date.now() - startTime;

      console.log(
        `[Worker] Concluído! ${syncedCount}/${youtubeVideos.length} músicas sincronizadas (${newTracksCount} novas) em ${duration}ms`
      );

      return {
        playlistId: syncedPlaylist.id,
        totalTracks: youtubeVideos.length,
        syncedTracks: syncedCount,
        failedTracks: failedCount,
        newTracks: newTracksCount,
        status: finalStatus,
        duration,
      };
    } catch (error) {
      console.error('[Worker] Erro crítico:', error);

      // Atualizar progresso com erro
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