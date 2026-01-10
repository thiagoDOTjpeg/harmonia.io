import { Router } from 'express';
import { SYNC_ROUTES } from '../../routes.constants';
import { SyncController } from '../controllers/SyncController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

router.post(
  SYNC_ROUTES.SYNC_PLAYLIST,
  AuthMiddleware.authenticate,
  SyncController.syncPlaylist
);

router.get(
  SYNC_ROUTES.STATUS,
  AuthMiddleware.authenticate,
  SyncController.getSyncStatus
);

router.delete(
  SYNC_ROUTES.CANCEL,
  AuthMiddleware.authenticate,
  SyncController.cancelSync
);

router.post(
  SYNC_ROUTES.RETRY,
  AuthMiddleware.authenticate,
  SyncController.retrySync
);

router.get(
  SYNC_ROUTES.QUEUE_STATS,
  AuthMiddleware.authenticate,
  SyncController.getQueueStats
);

export default router;