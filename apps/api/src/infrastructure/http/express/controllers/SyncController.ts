import { logger } from '@/infrastructure/logger';
import { baseSyncPlaylistSchema, createSyncPlaylistSchema } from '@harmonia/shared';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../domain/entities/User';
import { Container } from '../../../../main/container';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';


export class SyncController {
  static async syncPlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParsed = createSyncPlaylistSchema.parse(req.body);
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;

      const service = Container.getSyncMusicService();
      const result = await service.syncPlaylist(user, bodyParsed);

      return res.json(result);
    } catch (error) {
      logger.error({ err: error }, 'Sync playlist error');
      next(error)
    } 9
  }

  static async getSyncStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParsed = baseSyncPlaylistSchema.parse(req.params);

      const service = Container.getSyncMusicService();
      const result = service.getSyncStatus(queryParsed);

      return res.json(result);
    } catch (error) {
      logger.error({ err: error }, 'Get sync status error');
      next(error)
    }
  }

  static async cancelSync(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParsed = baseSyncPlaylistSchema.parse(req.params)
      const service = Container.getSyncMusicService();
      const result = service.cancelSync(queryParsed);

      return res.json(result);
    } catch (error) {
      logger.error({ err: error }, 'Cancel sync error');
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

  static async getQueueStats(req: Request, res: Response, next: NextFunction) {
    try {
      const service = Container.getSyncMusicService();
      const result = service.getQueueStatus();

      return res.json(result)
    } catch (error) {
      logger.error({ err: error }, 'Get queue stats error');
      next(error)
    }
  }
}