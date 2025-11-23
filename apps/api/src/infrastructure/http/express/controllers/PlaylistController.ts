import { User } from "@/domain/entities/User";
import { UserPlaylistsMapper } from "@/infrastructure/db/prisma/mapper/UserPlaylistsMapper";
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

      const playlistsDTO = playlists.map((playlist) => UserPlaylistsMapper.toDTO(playlist))

      return res.json(playlistsDTO);
    } catch (error) {
      console.error('Get playlists error:', error);
      throw error
    }
  }
}