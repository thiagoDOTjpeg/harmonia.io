import { prisma } from "../lib/prisma";
import google_oauth from "./google_oauth";
import matching_music from "./matching_music";
import spotify_oauth from "./spotify_oauth";

const sync_music = class sync_music {
  static async createSyncedPlaylist(
    userId: string,
    youtubeUrl: string
  ): Promise<{ id: string; message: string }> {

    // 1. Extrair ID da playlist do YouTube
    const youtubePlaylistId = google_oauth.extractPlaylistId(youtubeUrl);
    if (!youtubePlaylistId) {
      throw new Error('URL do YouTube inválida');
    }

    // 2. Verificar se já existe
    const existing = await prisma.syncedPlaylist.findFirst({
      where: {
        userId,
        youtubePlaylistId,
      },
    });

    if (existing) {
      throw new Error('Esta playlist já está sincronizada');
    }

    // 3. Buscar info da playlist do YouTube
    const ytPlaylist = await google_oauth.getPlaylistInfo(youtubePlaylistId);

    // 4. Criar playlist no Spotify
    const accessToken = await spotify_oauth.ensureValidToken(userId);
    const spotifyPlaylist = await spotify_oauth.createPlaylist(
      accessToken,
      `${ytPlaylist.snippet.title} (Sync)`,
      `Sincronizada do YouTube • ${ytPlaylist.snippet.channelTitle}`
    );

    // 5. Salvar no banco
    const synced = await prisma.syncedPlaylist.create({
      data: {
        userId,
        youtubePlaylistId,
        youtubeUrl,
        youtubeTitle: ytPlaylist.snippet.title,
        spotifyPlaylistId: spotifyPlaylist.id,
        spotifyUrl: spotifyPlaylist.external_urls.spotify,
        spotifyTitle: spotifyPlaylist.name,
        syncStatus: 'pending',
      },
    });

    // 6. Iniciar sincronização imediatamente
    await this.syncPlaylist(synced.id);

    return {
      id: synced.id,
      message: 'Playlist criada! Sincronização iniciada...',
    };
  }

  // Sincronizar playlist (chamado manualmente ou pelo worker)
  static async syncPlaylist(playlistId: string): Promise<void> {
    const playlist = await prisma.syncedPlaylist.findUnique({
      where: { id: playlistId },
      include: { user: true, tracks: true },
    });

    if (!playlist) {
      throw new Error('Playlist não encontrada');
    }

    try {
      // Atualizar status
      await prisma.syncedPlaylist.update({
        where: { id: playlistId },
        data: { syncStatus: 'syncing' },
      });

      console.log(`[Sync] Iniciando sync da playlist ${playlistId}`);

      // 1. Buscar músicas do YouTube
      const youtubeItems = await google_oauth.getPlaylistItems(
        playlist.youtubePlaylistId
      );

      console.log(`[Sync] ${youtubeItems.length} músicas encontradas no YouTube`);

      // 2. Identificar novas músicas
      const existingVideoIds = playlist.tracks.map((t) => t.youtubeVideoId);
      const newItems = youtubeItems.filter(
        (item) => !existingVideoIds.includes(item.snippet.resourceId.videoId)
      );

      if (newItems.length === 0) {
        console.log('[Sync] Nenhuma música nova');
        await prisma.syncedPlaylist.update({
          where: { id: playlistId },
          data: {
            syncStatus: 'completed',
            lastSyncedAt: new Date(),
          },
        });
        return;
      }

      console.log(`[Sync] ${newItems.length} músicas novas para adicionar`);

      // 3. Garantir token válido do Spotify
      const accessToken = await spotify_oauth.ensureValidToken(playlist.userId);

      // 4. Fazer matching e adicionar no Spotify
      const results: Array<{
        youtubeVideoId: string;
        youtubeTitle: string;
        spotifyTrack: any;
        matchScore: number;
        status: string;
      }> = [];

      for (const item of newItems) {
        try {
          const youtubeTitle = item.snippet.title;
          const youtubeVideoId = item.snippet.resourceId.videoId;

          // Gerar query de busca
          const query = matching_music.generateSpotifyQuery(youtubeTitle);

          // Buscar no Spotify
          const spotifyTrack = await spotify_oauth.searchTrack(accessToken, query);

          if (!spotifyTrack) {
            results.push({
              youtubeVideoId,
              youtubeTitle,
              spotifyTrack: null,
              matchScore: 0,
              status: 'failed',
            });
            continue;
          }

          // Calcular score de match
          const matchScore = matching_music.calculateMatchScore(
            youtubeTitle,
            spotifyTrack
          );

          results.push({
            youtubeVideoId,
            youtubeTitle,
            spotifyTrack,
            matchScore,
            status: matchScore > 0.6 ? 'matched' : 'failed',
          });

          // Rate limiting (Spotify aceita ~1 req/seg)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`[Sync] Erro ao processar ${item.snippet.title}:`, error);
          results.push({
            youtubeVideoId: item.snippet.resourceId.videoId,
            youtubeTitle: item.snippet.title,
            spotifyTrack: null,
            matchScore: 0,
            status: 'failed',
          });
        }
      }

      // 5. Adicionar tracks com match bom no Spotify
      const tracksToAdd = results
        .filter((r) => r.status === 'matched' && r.spotifyTrack)
        .map((r) => r.spotifyTrack.uri);

      if (tracksToAdd.length > 0) {
        await spotify_oauth.addTracksToPlaylist(
          accessToken,
          playlist.spotifyPlaylistId,
          tracksToAdd
        );
        console.log(`[Sync] ${tracksToAdd.length} músicas adicionadas no Spotify`);
      }

      // 6. Salvar tracks no banco
      await prisma.syncedTrack.createMany({
        data: results.map((r) => ({
          playlistId: playlist.id,
          youtubeVideoId: r.youtubeVideoId,
          youtubeTitle: r.youtubeTitle,
          spotifyTrackId: r.spotifyTrack?.id || null,
          spotifyUri: r.spotifyTrack?.uri || null,
          matchScore: r.matchScore,
          status: r.status,
        })),
      });

      // 7. Atualizar status final
      await prisma.syncedPlaylist.update({
        where: { id: playlistId },
        data: {
          syncStatus: 'completed',
          lastSyncedAt: new Date(),
        },
      });

      console.log(`[Sync] Concluído! ${tracksToAdd.length}/${results.length} músicas adicionadas`);
    } catch (error: any) {
      console.error('[Sync] Erro:', error);

      await prisma.syncedPlaylist.update({
        where: { id: playlistId },
        data: {
          syncStatus: 'failed',
        },
      });

      throw error;
    }
  }

  // Listar playlists do usuário
  static async getUserPlaylists(userId: string) {
    return prisma.syncedPlaylist.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tracks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Detalhes de uma playlist
  static async getPlaylistDetails(playlistId: string, userId: string) {
    const playlist = await prisma.syncedPlaylist.findFirst({
      where: { id: playlistId, userId },
      include: {
        tracks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!playlist) {
      throw new Error('Playlist não encontrada');
    }

    // Calcular estatísticas
    const totalTracks = playlist.tracks.length;
    const matched = playlist.tracks.filter((t) => t.status === 'matched').length;
    const failed = playlist.tracks.filter((t) => t.status === 'failed').length;
    const averageScore =
      totalTracks > 0
        ? playlist.tracks.reduce((sum, t) => sum + t.matchScore, 0) / totalTracks
        : 0;

    return {
      ...playlist,
      stats: {
        totalTracks,
        matched,
        failed,
        matchRate: totalTracks > 0 ? (matched / totalTracks) * 100 : 0,
        averageScore,
      },
    };
  }

  // Forçar re-sincronização
  static async forceSync(playlistId: string, userId: string): Promise<void> {
    const playlist = await prisma.syncedPlaylist.findFirst({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      throw new Error('Playlist não encontrada');
    }

    await this.syncPlaylist(playlistId);
  }

  // Deletar playlist sincronizada
  static async deleteSyncedPlaylist(playlistId: string, userId: string): Promise<void> {
    const playlist = await prisma.syncedPlaylist.findFirst({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      throw new Error('Playlist não encontrada');
    }

    await prisma.syncedPlaylist.delete({
      where: { id: playlistId },
    });
  }
}

export default sync_music;