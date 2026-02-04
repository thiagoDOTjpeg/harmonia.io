import { Router } from 'express';
import { SyncController } from '../../../../presentation/controllers/sync.controller';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

router.post(
  '/sync/playlist',
  AuthMiddleware.authenticate,
  SyncController.syncPlaylist
);

router.post(
  '/sync/:jobId/retry',
  AuthMiddleware.authenticate,
  SyncController.retrySync
);

export default router;