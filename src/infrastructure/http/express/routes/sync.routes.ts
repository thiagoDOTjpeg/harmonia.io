import { Router } from 'express';
import { z } from 'zod';
import { SyncController } from '../controllers/SyncController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { validateBody } from '../middlewares/ZodMiddleware';

const router = Router();

const SyncPlaylistSchema = z.object({
  youtubePlaylistId: z.string().min(1, 'YouTube Playlist ID é obrigatório'),
});

router.post(
  '/sync/playlist',
  AuthMiddleware.authenticate,
  validateBody(SyncPlaylistSchema),
  SyncController.syncPlaylist
);

router.get(
  '/sync/playlists',
  AuthMiddleware.authenticate,
  SyncController.getPlaylists
);

router.get(
  '/sync/playlists/:playlistId/tracks',
  AuthMiddleware.authenticate,
  SyncController.getPlaylistTracks
);

export default router;