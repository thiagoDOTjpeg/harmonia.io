import { User } from "@/domain/entities/User";
import { UserPlaylistsMapper } from "@/infrastructure/db/prisma/mapper/UserPlaylistsMapper";
import { logger } from '@/infrastructure/logger';
import { makePrismaIPlaylistRepository } from "@/main/factories/repositories.factory";
import { Request, Response } from 'express';
import { AuthMiddleware } from "../../infrastructure/http/express/middlewares/AuthMiddleware";

export class PlaylistController {
  static async getPlaylists(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const playlistRepository = makePrismaIPlaylistRepository();
      const playlists = await playlistRepository.findByUserIdView(user.id);

      const playlistsDTO = playlists.map((playlist) => UserPlaylistsMapper.toDTO(playlist))

      return res.json(playlistsDTO);
    } catch (error) {
      logger.error({ err: error }, 'Get playlists error');
      throw error
    }
  }
}