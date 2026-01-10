/**
 * Constantes centralizadas de rotas da API
 * 
 * Fonte única da verdade para paths de rotas.
 * Usado tanto pelo Express (routes) quanto pelo OpenAPI (docs).
 */

// ==================== AUTH ROUTES ====================

export const AUTH_ROUTES = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  REQUEST_RESET: '/auth/request-reset',
  RESET_PASSWORD: '/auth/reset-password',
  SET_PASSWORD: '/auth/set-password',
  REQUEST_ACCESS: '/auth/request-access',
  OAUTH_START: '/auth/:provider',
  OAUTH_CALLBACK: '/auth/:provider/callback',
} as const;

// ==================== USER ROUTES ====================

export const USER_ROUTES = {
  DASHBOARD: '/user/dashboard',
  CONNECTIONS: '/user/connections',
  CONNECTION_REVOKE: '/user/connection/:id',
} as const;

// ==================== PLAYLIST ROUTES ====================

export const PLAYLIST_ROUTES = {
  LIST: '/playlists',
} as const;

// ==================== SYNC ROUTES ====================

export const SYNC_ROUTES = {
  SYNC_PLAYLIST: '/sync/playlist',
  STATUS: '/sync/status/:jobId',
  CANCEL: '/sync/:jobId',
  RETRY: '/sync/:jobId/retry',
  QUEUE_STATS: '/sync/queue/stats',
} as const;

// ==================== HELPERS ====================


export function toOpenApiPath(expressPath: string): string {
  return expressPath.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
}

export function createOpenApiPaths<T extends Record<string, string>>(routes: T): T {
  const result = {} as Record<string, string>;
  for (const [key, value] of Object.entries(routes)) {
    result[key] = toOpenApiPath(value);
  }
  return result as T;
}

// Paths pré-convertidos para uso no OpenAPI
export const AUTH_ROUTES_OPENAPI = createOpenApiPaths(AUTH_ROUTES);
export const USER_ROUTES_OPENAPI = createOpenApiPaths(USER_ROUTES);
export const PLAYLIST_ROUTES_OPENAPI = createOpenApiPaths(PLAYLIST_ROUTES);
export const SYNC_ROUTES_OPENAPI = createOpenApiPaths(SYNC_ROUTES);
