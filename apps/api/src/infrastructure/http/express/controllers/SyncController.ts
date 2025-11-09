import { Request, Response } from 'express';
import { User } from '../../../../domain/entities/User';
import { Container } from '../../../../main/container';
import { PlaylistSyncQueue } from '../../../queue/PlaylistSyncQueue';
import { cancelSyncPlaylistSchema, createSyncPlaylistSchema, getSyncPlaylistStatusSchema, retrySyncPlaylistSchema } from '../../schemas/playlist-sync.schema';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const syncQueue = new PlaylistSyncQueue();

export class SyncController {
  static async syncPlaylist(req: Request, res: Response) {
    try {
      const bodyParsed = createSyncPlaylistSchema.parse(req.body);
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;

      const service = Container.getSyncMusicService();
      const result = await service.syncPlaylist(user, bodyParsed);

      return res.json(result);
    } catch (error) {
      console.error('Sync playlist error:', error);
      return res.status(500).json({
        error: 'sync_failed',
        message: 'Erro ao iniciar sincronização',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  static async getSyncStatus(req: Request, res: Response) {
    try {
      const queryParsed = getSyncPlaylistStatusSchema.parse(req.params);

      const service = Container.getSyncMusicService();
      const result = service.getSyncStatus(queryParsed);

      return res.json(result);
    } catch (error) {
      console.error('Get sync status error:', error);
      return res.status(500).json({
        error: 'fetch_failed',
        message: 'Erro ao buscar status',
      });
    }
  }

  static async cancelSync(req: Request, res: Response) {
    try {
      const queryParsed = cancelSyncPlaylistSchema.parse(req.params)
      const service = Container.getSyncMusicService();
      const result = service.cancelSync(queryParsed);

      return res.json(result);
    } catch (error) {
      console.error('Cancel sync error:', error);
      return res.status(500).json({
        error: 'cancel_failed',
        message: 'Erro ao cancelar sincronização',
      });
    }
  }

  static async retrySync(req: Request, res: Response) {
    try {
      const queryParsed = retrySyncPlaylistSchema.parse(req.params);
      const service = Container.getSyncMusicService();
      const result = service.cancelSync(queryParsed);

      return res.json(result);
    } catch (error) {
      console.error('Retry sync error:', error);
      return res.status(500).json({
        error: 'retry_failed',
        message: 'Erro ao reiniciar sincronização',
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

  static async getQueueStats(req: Request, res: Response) {
    try {
      const service = Container.getSyncMusicService();
      const result = service.getQueueStatus();

      return res.json(result)
    } catch (error) {
      console.error('Get queue stats error:', error);
      return res.status(500).json({
        error: 'fetch_failed',
        message: 'Erro ao buscar estatísticas',
      });
    }
  }

  static async getMyJobs(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

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
      return res.status(500).json({
        error: 'fetch_failed',
        message: 'Erro ao buscar jobs do usuário',
      });
    }
  }
}