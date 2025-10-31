import express from 'express';
import { requireAuth } from '../lib/auth';
import sync_music from '../services/sync_music';

const router = express.Router();

// Criar nova playlist sincronizada
router.post('/playlists', requireAuth, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const { youtubeUrl } = req.body as { youtubeUrl?: string };

    if (!youtubeUrl) {
      return res.status(400).json({ error: 'youtubeUrl é obrigatório' });
    }

    const result = await sync_music.createSyncedPlaylist(userId, youtubeUrl);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('[API] Erro ao criar playlist:', error);
    res.status(400).json({ error: error.message });
  }
});

// Listar playlists do usuário
router.get('/playlists', requireAuth, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const playlists = await sync_music.getUserPlaylists(userId);
    res.json(playlists);
  } catch (error: any) {
    console.error('[API] Erro ao listar playlists:', error);
    res.status(500).json({ error: error.message });
  }
});

// Detalhes de uma playlist
router.get('/playlists/:id', requireAuth, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const { id } = req.params;

    const playlist = await sync_music.getPlaylistDetails(id, userId);
    res.json(playlist);
  } catch (error: any) {
    console.error('[API] Erro ao buscar playlist:', error);
    res.status(404).json({ error: error.message });
  }
});

// Forçar sincronização
router.post('/playlists/:id/sync', requireAuth, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const { id } = req.params;

    await sync_music.forceSync(id, userId);
    res.json({ message: 'Sincronização iniciada' });
  } catch (error: any) {
    console.error('[API] Erro ao sincronizar:', error);
    res.status(400).json({ error: error.message });
  }
});

// Deletar playlist
router.delete('/playlists/:id', requireAuth, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const { id } = req.params;

    await sync_music.deleteSyncedPlaylist(id, userId);
    res.json({ message: 'Playlist deletada' });
  } catch (error: any) {
    console.error('[API] Erro ao deletar playlist:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;