import { Request, Response } from 'express';
import { User } from '../../../../domain/entities/User';
import { Container } from '../../../../main/container';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export class SyncController {
  static async syncPlaylist(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      if (!user.googleAccessToken || !user.spotifyAccessToken) {
        return res.status(400).json({
          error: 'missing_oauth',
          message: 'Você precisa conectar Google e Spotify primeiro',
        });
      }

      if (!user.spotifyId) {
        return res.status(400).json({
          error: 'missing_spotify_id',
          message: 'Spotify ID não encontrado',
        });
      }

      const { youtubePlaylistId } = req.body;

      if (!youtubePlaylistId) {
        return res.status(400).json({
          error: 'missing_playlist_id',
          message: 'youtubePlaylistId é obrigatório',
        });
      }

      const useCase = Container.getSyncYouTubePlaylistToSpotify();
      const result = await useCase.execute({
        userId: user.id,
        youtubePlaylistId,
        googleAccessToken: user.googleAccessToken,
        spotifyAccessToken: user.spotifyAccessToken,
        spotifyUserId: user.spotifyId,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Sync playlist error:', error);
      return res.status(500).json({
        error: 'sync_failed',
        message: 'Erro ao sincronizar playlist',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getPlaylists(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const playlistRepository = Container.getPlaylistRepository();
      const playlists = await playlistRepository.findByUserId(user.id);

      return res.json({
        success: true,
        data: playlists.map(p => ({
          id: p.id,
          youtubeTitle: p.youtubeTitle,
          spotifyTitle: p.spotifyTitle,
          youtubeUrl: p.youtubeUrl,
          spotifyUrl: p.spotifyUrl,
          syncStatus: p.syncStatus,
          lastSyncedAt: p.lastSyncedAt,
          createdAt: p.createdAt,
        })),
      });
    } catch (error) {
      console.error('Get playlists error:', error);
      return res.status(500).json({
        error: 'fetch_failed',
        message: 'Erro ao buscar playlists',
      });
    }
  }

  static async getPlaylistTracks(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const { playlistId } = req.params;

      const playlistRepository = Container.getPlaylistRepository();
      const playlist = await playlistRepository.findByYoutubePlaylistId(user.id, playlistId);

      if (!playlist) {
        return res.status(404).json({
          error: 'playlist_not_found',
          message: 'Playlist não encontrada',
        });
      }

      const playlistTrackRepository = Container.getPlaylistTrackRepository();
      const playlistTracks = await playlistTrackRepository.findByPlaylistId(playlist.id);

      const trackRepository = Container.getTrackRepository();
      const tracksData = await Promise.all(
        playlistTracks.map(async (pt) => {
          const track = await trackRepository.findByYoutubeVideoId(pt.trackId);
          return {
            playlistTrackId: pt.id,
            status: pt.status,
            position: pt.position,
            track: track ? {
              id: track.id,
              youtubeVideoId: track.youtubeVideoId,
              youtubeTitle: track.youtubeTitle,
              youtubeChannel: track.youtubeChannel,
              spotifyTrackId: track.spotifyTrackId,
              spotifyArtist: track.spotifyArtist,
              spotifyAlbum: track.spotifyAlbum,
              matchScore: track.matchScore,
              hasMatch: track.hasSpotifyMatch(),
            } : null,
          };
        })
      );

      return res.json({
        success: true,
        data: {
          playlist: {
            id: playlist.id,
            youtubeTitle: playlist.youtubeTitle,
            spotifyTitle: playlist.spotifyTitle,
            syncStatus: playlist.syncStatus,
          },
          tracks: tracksData,
        },
      });
    } catch (error) {
      console.error('Get playlist tracks error:', error);
      return res.status(500).json({
        error: 'fetch_failed',
        message: 'Erro ao buscar tracks da playlist',
      });
    }
  }
}