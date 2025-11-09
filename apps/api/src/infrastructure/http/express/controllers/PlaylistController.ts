import { User } from "@/domain/entities/User";
import { Container } from "@/main/container";
import { Request, Response } from 'express';
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export class PlaylistController {
  static async getPlaylists(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const playlistRepository = Container.getPlaylistRepository();
      const playlists = await playlistRepository.findByUserId(user.id);

      return res.json({
        success: true,
        data: playlists.map((p) => ({
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
}