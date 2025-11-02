import { Router } from 'express';
import { z } from 'zod';
import { SyncController } from '../controllers/SyncController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { validateBody } from '../middlewares/ZodMiddleware';

const router = Router();

const SyncPlaylistSchema = z.object({
  youtubePlaylistId: z.string().min(1, 'YouTube Playlist ID é obrigatório'),
  priority: z.number().min(1).max(100).optional(),
});

router.post(
  '/sync/playlist',
  AuthMiddleware.authenticate,
  validateBody(SyncPlaylistSchema),
  SyncController.syncPlaylist
);

router.get(
  '/sync/status/:jobId',
  AuthMiddleware.authenticate,
  SyncController.getSyncStatus
);

router.delete(
  '/sync/:jobId',
  AuthMiddleware.authenticate,
  SyncController.cancelSync
);

router.post(
  '/sync/:jobId/retry',
  AuthMiddleware.authenticate,
  SyncController.retrySync
);

router.get(
  '/sync/playlists',
  AuthMiddleware.authenticate,
  SyncController.getPlaylists
);

router.get(
  '/sync/queue/stats',
  AuthMiddleware.authenticate,
  SyncController.getQueueStats
);

router.get(
  '/sync/my-jobs',
  AuthMiddleware.authenticate,
  SyncController.getMyJobs
);

export default router;