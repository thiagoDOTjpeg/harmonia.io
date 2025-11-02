import { SpotifyMusicClient } from "../../../infrastructure/client/SpotifyMusicClient";
import { IGoogleOAuthClient } from "../../ports/oauth/IGoogleOAuthClient";
import { IPlaylistRepository } from "../../repositories/IPlaylistRepository";
import { IPlaylistTrackRepository } from "../../repositories/IPlaylistTrackRepository";
import { ITrackRepository } from "../../repositories/ITrackRepository";

export interface SyncPlaylistInput {
  userId: string;
  youtubePlaylistId: string;
  googleAccessToken: string;
  spotifyAccessToken: string;
  spotifyUserId: string;
}

export interface SyncPlaylistResult {
  playlistId: string;
  totalTracks: number;
  syncedTracks: number;
  failedTracks: number;
  newTracks: number;
  status: 'completed' | 'partial' | 'failed';
}

export class SyncYouTubePlaylistToSpotify {
  constructor(
    private readonly playlistRepository: IPlaylistRepository,
    private readonly trackRepository: ITrackRepository,
    private readonly playlistTrackRepository: IPlaylistTrackRepository,
    private readonly googleClient: IGoogleOAuthClient,
  ) { }

  async execute(input: SyncPlaylistInput): Promise<SyncPlaylistResult> {
    const spotifyClient = new SpotifyMusicClient(
      input.spotifyAccessToken,
      input.spotifyUserId
    );

    const youtubePlaylistInfo = await this.googleClient.getPlaylistInfo(
      input.youtubePlaylistId,
      input.googleAccessToken
    );

    const youtubeVideos = await this.googleClient.getPlaylistItems(
      input.youtubePlaylistId,
      input.googleAccessToken
    );

    console.log(`[Sync] ${youtubeVideos.length} vídeos encontrados no YouTube`);

    let syncedPlaylist = await this.playlistRepository.findByYoutubePlaylistId(
      input.userId,
      input.youtubePlaylistId
    );

    if (!syncedPlaylist) {
      const spotifyPlaylistId = await spotifyClient.createPlaylist(
        youtubePlaylistInfo.title,
        `Synced from YouTube • ${youtubePlaylistInfo.description || 'Harmonia.io'}`
      );

      console.log(`[Sync] Playlist criada no Spotify: ${spotifyPlaylistId}`);

      syncedPlaylist = await this.playlistRepository.create({
        userId: input.userId,
        youtubePlaylistId: input.youtubePlaylistId,
        youtubeUrl: `https://www.youtube.com/playlist?list=${input.youtubePlaylistId}`,
        youtubeTitle: youtubePlaylistInfo.title,
        spotifyPlaylistId,
        spotifyUrl: `https://open.spotify.com/playlist/${spotifyPlaylistId}`,
        spotifyTitle: youtubePlaylistInfo.title,
      });
    } else {
      console.log(`[Sync] Playlist já existe, atualizando...`);
    }

    const existingPlaylistTracks = await this.playlistTrackRepository.findByPlaylistId(
      syncedPlaylist.id
    );
    const existingTrackIds = new Set(existingPlaylistTracks.map(pt => pt.trackId));

    let syncedCount = 0;
    let failedCount = 0;
    let newTracksCount = 0;
    const tracksToAdd: string[] = [];

    for (let i = 0; i < youtubeVideos.length; i++) {
      const video = youtubeVideos[i];

      try {
        console.log(`[Sync] Processando (${i + 1}/${youtubeVideos.length}): ${video.title}`);

        let track = await this.trackRepository.findByYoutubeVideoId(video.videoId);

        if (!track) {
          track = await this.trackRepository.create({
            youtubeVideoId: video.videoId,
            youtubeTitle: video.title,
            youtubeChannel: video.channelTitle,
          });
        }

        if (!track.hasSpotifyMatch()) {
          const spotifyMatch = await spotifyClient.searchTrack(video.title);

          if (spotifyMatch) {
            track = await this.trackRepository.updateSpotifyMatch(track.id, {
              spotifyTrackId: spotifyMatch.trackId,
              spotifyUri: spotifyMatch.uri,
              spotifyArtist: spotifyMatch.artist,
              spotifyAlbum: spotifyMatch.album,
              matchScore: spotifyMatch.matchScore,
              matchSource: 'auto',
            });
          } else {
            console.log(`[Sync] ❌ Falha no match: ${video.title}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          console.log(`[Sync] ♻️  Reutilizando match: ${track.spotifyArtist} - ${track.spotifyTrackId}`);
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
            console.log(`[Sync] Track já existe na playlist (race condition): ${track.id}`);
          }
        }

        if (track.hasSpotifyMatch() && track.spotifyUri && isNewInPlaylist) {
          tracksToAdd.push(track.spotifyUri);
          syncedCount++;
        } else if (!track.hasSpotifyMatch()) {
          failedCount++;
        }
      } catch (error) {
        console.error(`[Sync] Erro ao processar ${video.videoId}:`, error);
        failedCount++;
      }
    }

    // 5. Adicionar tracks no Spotify (batch) - somente as novas
    if (tracksToAdd.length > 0) {
      console.log(`[Sync] Adicionando ${tracksToAdd.length} músicas novas no Spotify...`);

      await spotifyClient.addTracksToPlaylist(
        syncedPlaylist.spotifyPlaylistId,
        tracksToAdd
      );

      console.log(`[Sync] ✅ ${tracksToAdd.length} músicas adicionadas no Spotify`);
    } else {
      console.log(`[Sync] Nenhuma música nova para adicionar`);
    }

    // 6. Atualizar status da playlist
    const finalStatus =
      failedCount === 0 ? 'completed' :
        failedCount === youtubeVideos.length ? 'failed' :
          'partial';

    await this.playlistRepository.updateSyncStatus(syncedPlaylist.id, {
      status: finalStatus,
      lastSyncedAt: new Date(),
    });

    console.log(`[Sync] Concluído! ${syncedCount}/${youtubeVideos.length} músicas sincronizadas (${newTracksCount} novas)`);

    return {
      playlistId: syncedPlaylist.id,
      totalTracks: youtubeVideos.length,
      syncedTracks: syncedCount,
      failedTracks: failedCount,
      newTracks: newTracksCount,
      status: finalStatus,
    };
  }
}