import { baseSyncPlaylistSchema, createSyncPlaylistSchema } from '@harmonia/shared';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { SYNC_ROUTES_OPENAPI } from '../../http/routes.constants';

// ==================== SCHEMAS DE RESPONSE ====================

const SyncPlaylistResponseSchema = z.object({
  jobId: z.string(),
  playlistId: z.string().optional(),
  status: z.enum(['pending', 'queued', 'processing', 'completed', 'failed']),
  message: z.string(),
}).openapi('SyncPlaylistResponse');

const RetrySyncResponseSchema = z.object({
  success: z.boolean().optional(),
  error: z.string().optional(),
  message: z.string(),
}).openapi('RetrySyncResponse');

// ==================== SCHEMAS DE ERRO ====================

const ValidationErrorSchema = z.object({
  error: z.literal('bad_request'),
  message: z.string(),
}).openapi('ValidationError');

const UnauthorizedErrorSchema = z.object({
  error: z.literal('unathorized'),
  message: z.string(),
}).openapi('UnauthorizedError');

const NotFoundErrorSchema = z.object({
  message: z.string(),
}).openapi('NotFoundError');

const PlaylistLimitErrorSchema = z.object({
  error: z.literal('bad_request'),
  message: z.string().openapi({
    example: 'Limite de playlists excedido',
    description: 'Usuário atingiu o limite de playlists do plano atual'
  }),
}).openapi('PlaylistLimitError');

// ==================== FUNÇÃO DE REGISTRO ====================

/**
 * Registra todas as rotas de sincronização no OpenAPI Registry
 */
export function registerSyncDocs(registry: OpenAPIRegistry): void {
  // Registrar schemas de input
  registry.register('CreateSyncPlaylistInput', createSyncPlaylistSchema.openapi({
    description: 'Dados para iniciar sincronização de playlist',
    example: {
      youtubePlaylistId: 'PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      priority: 50,
    },
  }));

  registry.register('BaseSyncPlaylistInput', baseSyncPlaylistSchema.openapi({
    description: 'ID do job de sincronização',
    example: {
      jobId: '550e8400-e29b-41d4-a716-446655440000',
    },
  }));

  // POST /sync/playlist
  registry.registerPath({
    method: 'post',
    path: SYNC_ROUTES_OPENAPI.SYNC_PLAYLIST,
    tags: ['Sync'],
    summary: 'Iniciar sincronização de playlist',
    description: 'Adiciona uma playlist do YouTube à fila de sincronização com o Spotify',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createSyncPlaylistSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Sincronização iniciada - job adicionado à fila',
        content: {
          'application/json': {
            schema: SyncPlaylistResponseSchema,
          },
        },
      },
      400: {
        description: 'Dados inválidos ou limite de playlists excedido',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
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
      403: {
        description: 'Limite de playlists do plano excedido',
        content: {
          'application/json': {
            schema: PlaylistLimitErrorSchema,
          },
        },
      },
    },
  });

  // POST /sync/:jobId/retry
  registry.registerPath({
    method: 'post',
    path: SYNC_ROUTES_OPENAPI.RETRY,
    tags: ['Sync'],
    summary: 'Retentar sincronização',
    description: 'Adiciona um job falho novamente à fila de sincronização',
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        jobId: z.string().openapi({
          description: 'ID do job de sincronização',
          example: '550e8400-e29b-41d4-a716-446655440000',
        }),
      }),
    },
    responses: {
      200: {
        description: 'Job readicionado à fila',
        content: {
          'application/json': {
            schema: RetrySyncResponseSchema,
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
      404: {
        description: 'Job não encontrado',
        content: {
          'application/json': {
            schema: NotFoundErrorSchema,
          },
        },
      },
    },
  });
}
