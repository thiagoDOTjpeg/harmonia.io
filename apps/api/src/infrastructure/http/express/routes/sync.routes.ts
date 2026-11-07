import { Router } from 'express';
import { SyncController } from '../../../../presentation/controllers/sync.controller';
import { SYNC_ROUTES } from '../../routes.constants';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

router.post(
  SYNC_ROUTES.SYNC_PLAYLIST,
  AuthMiddleware.authenticate,
  SyncController.syncPlaylist
);

router.post(
  SYNC_ROUTES.RETRY,
  AuthMiddleware.authenticate,
  SyncController.retrySync
);

export default router;