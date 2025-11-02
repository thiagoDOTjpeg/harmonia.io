import { Request, Response } from 'express';
import { User } from '../../../../domain/entities/User';
import { Container } from '../../../../main/container';
import { PlaylistSyncQueue } from '../../../queue/PlaylistSyncQueue';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

// Instância global da fila
const syncQueue = new PlaylistSyncQueue();

export class SyncController {
  static async syncPlaylist(req: Request, res: Response) {
    try {
      // 1. Pegar usuário autenticado
      const user = await AuthMiddleware.getAuthenticatedUser(req, res) as User;
      if (!user) return;

      // 2. Validar que usuário tem Google e Spotify conectados
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

      // 3. Pegar playlist ID do YouTube
      const { youtubePlaylistId, priority } = req.body;

      if (!youtubePlaylistId) {
        return res.status(400).json({
          error: 'missing_playlist_id',
          message: 'youtubePlaylistId é obrigatório',
        });
      }

      // 4. Verificar se playlist já existe
      const playlistRepository = Container.getPlaylistRepository();
      let playlist = await playlistRepository.findByYoutubePlaylistId(
        user.id,
        youtubePlaylistId
      );

      // 5. Adicionar job na fila
      const job = await syncQueue.addSyncJob({
        playlistId: playlist?.id || `temp-${Date.now()}`, // Se não existe, será criado
        userId: user.id,
        youtubePlaylistId,
        googleAccessToken: user.googleAccessToken,
        spotifyAccessToken: user.spotifyAccessToken,
        spotifyUserId: user.spotifyId,
        priority: priority || 10,
      });

      console.log(`[API] Job ${job.id} adicionado para sincronização`);

      // 6. Retornar ID do job para o cliente acompanhar
      return res.json({
        success: true,
        data: {
          jobId: job.id,
          playlistId: playlist?.id,
          status: 'pending',
          message: 'Sincronização iniciada. Use /sync/status/:jobId para acompanhar',
        },
      });
    } catch (error) {
      console.error('Sync playlist error:', error);
      return res.status(500).json({
        error: 'sync_failed',
        message: 'Erro ao iniciar sincronização',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getSyncStatus(req: Request, res: Response) {
    try {
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      if (!user) return;

      const { jobId } = req.params;

      // Buscar status do job
      const job = await syncQueue.getQueue().getJob(jobId);

      if (!job) {
        return res.status(404).json({
          error: 'job_not_found',
          message: 'Job não encontrado',
        });
      }

      const state = await job.getState();
      const progress = job.progress();

      return res.json({
        success: true,
        data: {
          jobId: job.id,
          state,
          progress,
          finishedOn: job.finishedOn,
          processedOn: job.processedOn,
          returnvalue: job.returnvalue,
        },
      });
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
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      if (!user) return;

      const { jobId } = req.params;

      const cancelled = await syncQueue.cancelSync(jobId);

      if (!cancelled) {
        return res.status(404).json({
          error: 'job_not_found',
          message: 'Job não encontrado ou já finalizado',
        });
      }

      return res.json({
        success: true,
        message: 'Sincronização cancelada',
      });
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
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      if (!user) return;

      const { jobId } = req.params;

      const retried = await syncQueue.retrySync(jobId);

      if (!retried) {
        return res.status(404).json({
          error: 'job_not_found',
          message: 'Job não encontrado',
        });
      }

      return res.json({
        success: true,
        message: 'Sincronização reiniciada',
      });
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
      const user = await AuthMiddleware.getAuthenticatedUser(req, res);
      if (!user) return;

      const stats = await syncQueue.getStats();

      return res.json({
        success: true,
        data: stats,
      });
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