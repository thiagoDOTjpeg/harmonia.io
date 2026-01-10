import { baseSyncPlaylistSchema, createSyncPlaylistSchema } from '@harmonia/shared';
import { z } from 'zod';
import { registry } from '../openApiRegistry';

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

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
}).openapi('ErrorResponse');

const MessageResponseSchema = z.object({
  message: z.string(),
}).openapi('MessageResponse');

// ==================== REGISTRAR SCHEMAS ====================

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

// ==================== REGISTRAR ROTAS ====================

// POST /sync/playlist
registry.registerPath({
  method: 'post',
  path: '/sync/playlist',
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
      description: 'Sincronização iniciada',
      content: {
        'application/json': {
          schema: SyncPlaylistResponseSchema,
        },
      },
    },
    400: {
      description: 'Dados inválidos',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
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
    403: {
      description: 'Limite de playlists excedido',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// GET /sync/status/:jobId
registry.registerPath({
  method: 'get',
  path: '/sync/status/{jobId}',
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
      description: 'Não autorizado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Job não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// DELETE /sync/:jobId
registry.registerPath({
  method: 'delete',
  path: '/sync/{jobId}',
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
      description: 'Não autorizado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Job não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// POST /sync/:jobId/retry
registry.registerPath({
  method: 'post',
  path: '/sync/{jobId}/retry',
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
      description: 'Não autorizado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    404: {
      description: 'Job não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// GET /sync/queue/stats
registry.registerPath({
  method: 'get',
  path: '/sync/queue/stats',
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
      description: 'Não autorizado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});
