import { Router } from 'express';
import { SyncController } from '../controllers/SyncController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

router.post(
  '/sync/playlist',
  AuthMiddleware.authenticate,
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