import { StartYoutubePlaylistToSpotifySyncPayload } from '@/application/use_cases/sync/StartYoutubePlaylistToSpotifySyncUseCase';
import { logger } from '@/infrastructure/logger';
import { makeEnsureValidConnectionsUseCase } from '@/main/factories/service-connection.factory';
import { makeStartYoutubePlaylistToSpotifySyncUseCase } from '@/main/factories/sync.factory';
import { baseSyncPlaylistSchema, createSyncPlaylistSchema } from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../domain/entities/User';
import { AuthMiddleware } from '../../infrastructure/http/express/middlewares/AuthMiddleware';
import { Container } from '../../main/container';


export class SyncController {
  static async syncPlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParsed = createSyncPlaylistSchema.parse(req.body);
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;

      const connections = await makeEnsureValidConnectionsUseCase().execute(user.id);

      const payload: StartYoutubePlaylistToSpotifySyncPayload = {
        connections,
        userId: user.id,
        youtubePlaylistId: bodyParsed.youtubePlaylistId,
        priority: bodyParsed.priority
      };

      const useCase = makeStartYoutubePlaylistToSpotifySyncUseCase();
      const result = await useCase.execute(payload);

      return res.json(result);
    } catch (error) {
      logger.error({ err: error }, 'Sync playlist error');
      next(error)
    }
  }

  static async retrySync(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParsed = baseSyncPlaylistSchema.parse(req.params);
      const service = Container.getSyncMusicService();
      const result = service.retrySync(queryParsed);

      return res.json(result);
    } catch (error) {
      logger.error({ err: error }, 'Retry sync error');
      next(error)
    }
  }
}