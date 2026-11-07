import { User } from "@/domain/entities/User";
import { UserPlaylistsMapper } from "@/infrastructure/db/prisma/mapper/UserPlaylistsMapper";
import { logger } from '@/infrastructure/logger';
import {
  makeDeletePlaylistUseCase,
  makeGetPlaylistDetailsUseCase,
  makeGetTrackCandidatesUseCase,
  makeManualMatchTrackUseCase,
} from "@/main/factories/playlist.factory";
import { makePrismaIPlaylistRepository } from "@/main/factories/repositories.factory";
import { makeEnsureValidConnectionsUseCase } from "@/main/factories/service-connection.factory";
import { matchTrackSchema } from "@harmonia/shared";
import { NextFunction, Request, Response } from 'express';
import { AuthMiddleware } from "../../infrastructure/http/express/middlewares/AuthMiddleware";

export class PlaylistController {
  static async getPlaylists(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const playlistRepository = makePrismaIPlaylistRepository();
      const playlists = await playlistRepository.findByUserIdView(user.id);

      const playlistsDTO = playlists.map((playlist) => UserPlaylistsMapper.toDTO(playlist))

      return res.json(playlistsDTO);
    } catch (error) {
      logger.error({ err: error }, 'Get playlists error');
      next(error);
    }
  }

  static async getPlaylistDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const { id } = req.params;
      const useCase = makeGetPlaylistDetailsUseCase();
      const details = await useCase.execute(id, user.id);

      return res.json(details);
    } catch (error) {
      logger.error({ err: error }, 'Get playlist details error');
      next(error);
    }
  }

  static async deletePlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const { id } = req.params;
      const useCase = makeDeletePlaylistUseCase();
      await useCase.execute(id, user.id);

      return res.status(204).send();
    } catch (error) {
      logger.error({ err: error }, 'Delete playlist error');
      next(error);
    }
  }

  static async getTrackCandidates(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const { id, trackId } = req.params;
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;

      const connections = await makeEnsureValidConnectionsUseCase().execute(user.id);
      const useCase = makeGetTrackCandidatesUseCase();
      const result = await useCase.execute({
        playlistId: id,
        trackId,
        userId: user.id,
        connections,
        query,
      });

      return res.json(result);
    } catch (error) {
      logger.error({ err: error }, 'Get track candidates error');
      next(error);
    }
  }

  static async matchTrack(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      const { id, trackId } = req.params;
      const bodyParsed = matchTrackSchema.parse(req.body);

      const connections = bodyParsed.syncNow
        ? await makeEnsureValidConnectionsUseCase().execute(user.id)
        : undefined;

      const useCase = makeManualMatchTrackUseCase();
      const result = await useCase.execute({
        ...bodyParsed,
        playlistId: id,
        trackId,
        userId: user.id,
        connections,
      });

      return res.json(result);
    } catch (error) {
      logger.error({ err: error }, 'Match track error');
      next(error);
    }
  }
}