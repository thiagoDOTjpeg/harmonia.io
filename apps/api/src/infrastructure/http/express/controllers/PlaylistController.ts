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
      const playlists = await playlistRepository.findByUserIdView(user.id);

      return res.json(playlists);
    } catch (error) {
      console.error('Get playlists error:', error);
      throw error
    }
  }
}