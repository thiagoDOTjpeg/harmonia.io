import { Router } from 'express';
import { z } from 'zod';
import { SyncController } from '../controllers/SyncController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { validateBody } from '../middlewares/ZodMiddleware';

const router = Router();

// Schema para sync de playlist
const SyncPlaylistSchema = z.object({
  youtubePlaylistId: z.string().min(1, 'YouTube Playlist ID é obrigatório'),
  priority: z.number().min(1).max(100).optional(),
});

// Iniciar sincronização de playlist (adiciona na fila)
router.post(
  '/sync/playlist',
  AuthMiddleware.authenticate,
  validateBody(SyncPlaylistSchema),
  SyncController.syncPlaylist
);

// Verificar status de uma sincronização
router.get(
  '/sync/status/:jobId',
  AuthMiddleware.authenticate,
  SyncController.getSyncStatus
);

// Cancelar sincronização
router.delete(
  '/sync/:jobId',
  AuthMiddleware.authenticate,
  SyncController.cancelSync
);

// Reiniciar sincronização falhada
router.post(
  '/sync/:jobId/retry',
  AuthMiddleware.authenticate,
  SyncController.retrySync
);

// Listar playlists sincronizadas do usuário
router.get(
  '/sync/playlists',
  AuthMiddleware.authenticate,
  SyncController.getPlaylists
);

// Estatísticas da fila
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