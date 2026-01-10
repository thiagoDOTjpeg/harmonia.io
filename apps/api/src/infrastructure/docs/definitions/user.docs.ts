import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { USER_ROUTES_OPENAPI } from '../../http/routes.constants';

// ==================== SCHEMAS DE RESPONSE ====================

const RecentSyncSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  source_platform: z.string(),
  target_platform: z.string(),
  songs_count: z.number(),
  last_synced_at: z.string().datetime(),
  status: z.string(),
}).openapi('RecentSync');

const UserSummaryResponseSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  user_created_at: z.string().datetime(),
  is_spotify_connected: z.boolean(),
  is_youtube_connected: z.boolean(),
  total_playlists: z.number(),
  synced_playlists: z.number(),
  total_songs: z.number(),
  synced_songs: z.number(),
  synced_songs_last_7_days: z.number(),
  last_sync_at: z.string().datetime().nullable(),
  recent_syncs: z.array(RecentSyncSchema).nullable(),
}).openapi('UserSummaryResponse');

const ServiceConnectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  provider: z.enum(['google', 'spotify']),
  providerAccountId: z.string(),
  email: z.string().email().nullable(),
  expiresAt: z.string().datetime().nullable(),
  scopes: z.string(),
  metadata: z.string().nullable(),
  createdAt: z.string().datetime(),
}).openapi('ServiceConnection');

const MessageResponseSchema = z.object({
  message: z.string(),
}).openapi('MessageResponse');

// ==================== SCHEMAS DE ERRO ====================

const UnauthorizedErrorSchema = z.object({
  error: z.literal('unathorized'),
  message: z.string(),
}).openapi('UnauthorizedError');

const NotFoundErrorSchema = z.object({
  message: z.string(),
}).openapi('NotFoundError');

// ==================== FUNÇÃO DE REGISTRO ====================

/**
 * Registra todas as rotas de usuário no OpenAPI Registry
 */
export function registerUserDocs(registry: OpenAPIRegistry): void {
  // GET /user/dashboard
  registry.registerPath({
    method: 'get',
    path: USER_ROUTES_OPENAPI.DASHBOARD,
    tags: ['User'],
    summary: 'Obter resumo do dashboard',
    description: 'Retorna dados resumidos do usuário para exibição no dashboard',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Dados do dashboard',
        content: {
          'application/json': {
            schema: UserSummaryResponseSchema,
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

  // GET /user/connections
  registry.registerPath({
    method: 'get',
    path: USER_ROUTES_OPENAPI.CONNECTIONS,
    tags: ['User'],
    summary: 'Listar conexões de serviços',
    description: 'Retorna todas as conexões OAuth do usuário (Google, Spotify)',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Lista de conexões',
        content: {
          'application/json': {
            schema: z.array(ServiceConnectionSchema),
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

  // DELETE /user/connection/:id
  registry.registerPath({
    method: 'delete',
    path: USER_ROUTES_OPENAPI.CONNECTION_REVOKE,
    tags: ['User'],
    summary: 'Revogar conexão de serviço',
    description: 'Remove uma conexão OAuth específica do usuário',
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().uuid().openapi({
          description: 'ID da conexão a ser revogada',
          example: '550e8400-e29b-41d4-a716-446655440000',
        }),
      }),
    },
    responses: {
      200: {
        description: 'Conexão revogada com sucesso',
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
        description: 'Conexão não encontrada',
        content: {
          'application/json': {
            schema: NotFoundErrorSchema,
          },
        },
      },
    },
  });
}
