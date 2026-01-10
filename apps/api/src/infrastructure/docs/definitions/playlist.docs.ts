import { z } from 'zod';
import { registry } from '../openApiRegistry';

// ==================== SCHEMAS DE RESPONSE ====================

const UserPlaylistSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  youtube_playlist_id: z.string(),
  youtube_title: z.string().nullable(),
  spotify_playlist_id: z.string(),
  spotify_title: z.string().nullable(),
  sync_status: z.enum(['pending', 'syncing', 'synced', 'failed']),
  last_synced_at: z.string().datetime().nullable(),
  songs: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
}).openapi('UserPlaylist');

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
}).openapi('ErrorResponse');

// ==================== REGISTRAR ROTAS ====================

// GET /playlists
registry.registerPath({
  method: 'get',
  path: '/playlists',
  tags: ['Playlist'],
  summary: 'Listar playlists do usuário',
  description: 'Retorna todas as playlists sincronizadas do usuário',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Lista de playlists',
      content: {
        'application/json': {
          schema: z.array(UserPlaylistSchema),
        },
      },
    },
    401: {
      description: 'Não autorizado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});
