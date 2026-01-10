import { baseSyncPlaylistSchema, createSyncPlaylistSchema } from '@harmonia/shared';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { SYNC_ROUTES_OPENAPI } from '../../http/routes.constants';

// ==================== SCHEMAS DE RESPONSE ====================

const SyncPlaylistResponseSchema = z.object({
  jobId: z.string().uuid(),
  playlistId: z.string().nullable(),
  status: z.enum(['queued', 'processing', 'completed', 'failed']),
  message: z.string(),
}).openapi('SyncPlaylistResponse');

const SyncStatusResponseSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(['queued', 'processing', 'completed', 'failed']),
  progress: z.number().min(0).max(100).optional(),
  playlistId: z.string().nullable(),
  error: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).openapi('SyncStatusResponse');

const QueueStatsResponseSchema = z.object({
  waiting: z.number(),
  active: z.number(),
  completed: z.number(),
  failed: z.number(),
  delayed: z.number(),
}).openapi('QueueStatsResponse');

const MessageResponseSchema = z.object({
  message: z.string(),
}).openapi('MessageResponse');

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
      202: {
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

  // GET /sync/status/:jobId
  registry.registerPath({
    method: 'get',
    path: SYNC_ROUTES_OPENAPI.STATUS,
    tags: ['Sync'],
    summary: 'Verificar status da sincronização',
    description: 'Retorna o status atual de um job de sincronização',
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        jobId: z.string().uuid().openapi({
          description: 'ID do job de sincronização',
          example: '550e8400-e29b-41d4-a716-446655440000',
        }),
      }),
    },
    responses: {
      200: {
        description: 'Status do job',
        content: {
          'application/json': {
            schema: SyncStatusResponseSchema,
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

  // DELETE /sync/:jobId
  registry.registerPath({
    method: 'delete',
    path: SYNC_ROUTES_OPENAPI.CANCEL,
    tags: ['Sync'],
    summary: 'Cancelar sincronização',
    description: 'Cancela um job de sincronização em andamento ou na fila',
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        jobId: z.string().uuid().openapi({
          description: 'ID do job de sincronização',
          example: '550e8400-e29b-41d4-a716-446655440000',
        }),
      }),
    },
    responses: {
      200: {
        description: 'Job cancelado',
        content: {
          'application/json': {
            schema: MessageResponseSchema,
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
        jobId: z.string().uuid().openapi({
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
            schema: SyncPlaylistResponseSchema,
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

  // GET /sync/queue/stats
  registry.registerPath({
    method: 'get',
    path: SYNC_ROUTES_OPENAPI.QUEUE_STATS,
    tags: ['Sync'],
    summary: 'Estatísticas da fila',
    description: 'Retorna estatísticas da fila de sincronização',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Estatísticas da fila',
        content: {
          'application/json': {
            schema: QueueStatsResponseSchema,
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
