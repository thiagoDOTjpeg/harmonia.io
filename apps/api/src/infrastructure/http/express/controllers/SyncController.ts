import { NextFunction, Request, Response } from 'express';
import { User } from '../../../../domain/entities/User';
import { Container } from '../../../../main/container';
import { PlaylistSyncQueue } from '../../../queue/PlaylistSyncQueue';
import { cancelSyncPlaylistSchema, createSyncPlaylistSchema, getSyncPlaylistStatusSchema, retrySyncPlaylistSchema } from '../../schemas/playlist-sync.schema';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const syncQueue = new PlaylistSyncQueue();

export class SyncController {
  static async syncPlaylist(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParsed = createSyncPlaylistSchema.parse(req.body);
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;

      const service = Container.getSyncMusicService();
      const result = await service.syncPlaylist(user, bodyParsed);

      return res.json(result);
    } catch (error) {
      console.error('Sync playlist error:', error);
      next(error)
    }
  }

  static async getSyncStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParsed = getSyncPlaylistStatusSchema.parse(req.params);

      const service = Container.getSyncMusicService();
      const result = service.getSyncStatus(queryParsed);

      return res.json(result);
    } catch (error) {
      console.error('Get sync status error:', error);
      next(error)
    }
  }

  static async cancelSync(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParsed = cancelSyncPlaylistSchema.parse(req.params)
      const service = Container.getSyncMusicService();
      const result = service.cancelSync(queryParsed);

      return res.json(result);
    } catch (error) {
      console.error('Cancel sync error:', error);
      next(error)
    }
  }

  static async retrySync(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParsed = retrySyncPlaylistSchema.parse(req.params);
      const service = Container.getSyncMusicService();
      const result = service.cancelSync(queryParsed);

      return res.json(result);
    } catch (error) {
      console.error('Retry sync error:', error);
      next(error)
    }
  }

  static async getQueueStats(req: Request, res: Response, next: NextFunction) {
    try {
      const service = Container.getSyncMusicService();
      const result = service.getQueueStatus();

      return res.json(result)
    } catch (error) {
      console.error('Get queue stats error:', error);
      next(error)
    }
  }

  static async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;

      const { states } = req.query;
      const stateFilter = states
        ? (states as string).split(',')
        : ['waiting', 'active', 'completed', 'failed'];

      const jobs = await syncQueue.getUserJobs(user.id, stateFilter as any);

      return res.json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      console.error('Get user jobs error:', error);
      next(error)
    }
  }
}