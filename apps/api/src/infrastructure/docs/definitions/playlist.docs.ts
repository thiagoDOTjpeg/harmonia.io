import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { PLAYLIST_ROUTES_OPENAPI } from '../../http/routes.constants';

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

// ==================== SCHEMAS DE ERRO ====================

const UnauthorizedErrorSchema = z.object({
  error: z.literal('unathorized'),
  message: z.string(),
}).openapi('UnauthorizedError');

// ==================== FUNÇÃO DE REGISTRO ====================

/**
 * Registra todas as rotas de playlist no OpenAPI Registry
 */
export function registerPlaylistDocs(registry: OpenAPIRegistry): void {
  // GET /playlists
  registry.registerPath({
    method: 'get',
    path: PLAYLIST_ROUTES_OPENAPI.LIST,
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
        description: 'Token JWT ausente, inválido ou expirado',
        content: {
          'application/json': {
            schema: UnauthorizedErrorSchema,
          },
        },
      },
    },
  });
}
