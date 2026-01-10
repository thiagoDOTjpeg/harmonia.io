import {
  LoginSchema,
  OAuthQuerySchema,
  RegisterSchema,
  RequestAccessSchema,
  RequestResetPasswordInput,
  ResetPasswordInput,
  SetPasswordInput,
} from '@harmonia/shared';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { AUTH_ROUTES_OPENAPI } from '../../http/routes.constants';

// ==================== SCHEMAS DE RESPONSE ====================

const AuthResponseSchema = z.object({
  token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email().nullable(),
    name: z.string().nullable(),
  }),
  method: z.enum(['login', 'register', 'connect']).optional(),
  returnTo: z.string().url().optional(),
  isPasswordSetupRequired: z.boolean(),
}).openapi('AuthResponse');

const MessageResponseSchema = z.object({
  message: z.string(),
}).openapi('MessageResponse');

// ==================== SCHEMAS DE ERRO ESPECÍFICOS ====================
// Alinhados com ErrorHandlerMiddleware

/**
 * Erro de validação (Zod)
 * Retornado quando a validação de input falha
 */
const ValidationErrorSchema = z.object({
  error: z.literal('bad_request'),
  message: z.string().openapi({ 
    example: 'Validation error: email is required',
    description: 'Mensagem detalhada do erro de validação'
  }),
}).openapi('ValidationError');

/**
 * Erro de credenciais inválidas
 * Retornado em login com email/senha incorretos
 */
const InvalidCredentialsErrorSchema = z.object({
  error: z.literal('invalid_credentials'),
  message: z.string().openapi({
    example: 'Email ou senha incorretos',
    description: 'Credenciais fornecidas não correspondem a nenhum usuário'
  }),
}).openapi('InvalidCredentialsError');

/**
 * Erro de não autorizado
 * Retornado quando o token JWT é inválido ou expirado
 */
const UnauthorizedErrorSchema = z.object({
  error: z.literal('unathorized'),
  message: z.string().openapi({
    example: 'Token inválido ou expirado',
    description: 'Acesso negado - token JWT ausente, inválido ou expirado'
  }),
}).openapi('UnauthorizedError');

/**
 * Erro de recurso não encontrado
 * Retornado quando o recurso solicitado não existe
 */
const NotFoundErrorSchema = z.object({
  message: z.string().openapi({
    example: 'Usuário não encontrado',
    description: 'O recurso solicitado não foi encontrado'
  }),
}).openapi('NotFoundError');

/**
 * Erro de conflito (recurso já existe)
 * Retornado quando há tentativa de criar recurso duplicado
 */
const ConflictErrorSchema = z.object({
  error: z.literal('bad_request'),
  message: z.string().openapi({
    example: 'Email já cadastrado',
    description: 'O recurso já existe no sistema'
  }),
}).openapi('ConflictError');

/**
 * Erro interno do servidor
 * Retornado em erros não tratados
 */
const InternalErrorSchema = z.object({
  error: z.literal('internal_error'),
  message: z.string().openapi({
    example: 'Erro Interno de Servidor',
    description: 'Erro inesperado no servidor'
  }),
}).openapi('InternalError');

// ==================== FUNÇÃO DE REGISTRO ====================

/**
 * Registra todas as rotas de autenticação no OpenAPI Registry
 * Chamada explicitamente pelo swaggerGenerator (sem side-effects)
 */
export function registerAuthDocs(registry: OpenAPIRegistry): void {
  // Registrar security scheme
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Token JWT obtido após login ou registro. Enviar no header Authorization: Bearer <token>',
  });

  // Registrar schemas de input
  registry.register('RegisterInput', RegisterSchema.openapi({
    description: 'Dados para registro de novo usuário',
    example: {
      email: 'usuario@exemplo.com',
      password: 'senhaSegura123',
      name: 'João Silva',
    },
  }));

  registry.register('LoginInput', LoginSchema.openapi({
    description: 'Credenciais para login',
    example: {
      email: 'usuario@exemplo.com',
      password: 'senhaSegura123',
    },
  }));

  registry.register('RequestResetPasswordInput', RequestResetPasswordInput.openapi({
    description: 'Email para solicitar reset de senha',
    example: {
      email: 'usuario@exemplo.com',
    },
  }));

  registry.register('ResetPasswordInput', ResetPasswordInput.openapi({
    description: 'Dados para resetar a senha',
    example: {
      email: 'usuario@exemplo.com',
      code: '123456',
      newPassword: 'novaSenhaSegura123',
    },
  }));

  registry.register('SetPasswordInput', SetPasswordInput.openapi({
    description: 'Nova senha para definir',
    example: {
      newPassword: 'novaSenhaSegura123',
    },
  }));

  registry.register('RequestAccessInput', RequestAccessSchema.openapi({
    description: 'Dados para solicitar acesso antecipado',
    example: {
      name: 'João Silva',
      email: 'joao@exemplo.com',
      reason: 'Quero sincronizar minhas playlists do YouTube com o Spotify',
    },
  }));

  // ==================== ROTAS ====================

  // POST /auth/register
  registry.registerPath({
    method: 'post',
    path: AUTH_ROUTES_OPENAPI.REGISTER,
    tags: ['Auth'],
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário com email e senha',
    request: {
      body: {
        content: {
          'application/json': {
            schema: RegisterSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Usuário criado com sucesso',
        content: {
          'application/json': {
            schema: AuthResponseSchema,
          },
        },
      },
      400: {
        description: 'Dados inválidos - falha na validação do input',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
          },
        },
      },
      409: {
        description: 'Email já cadastrado',
        content: {
          'application/json': {
            schema: ConflictErrorSchema,
          },
        },
      },
    },
  });

  // POST /auth/login
  registry.registerPath({
    method: 'post',
    path: AUTH_ROUTES_OPENAPI.LOGIN,
    tags: ['Auth'],
    summary: 'Login de usuário',
    description: 'Autentica um usuário com email e senha',
    request: {
      body: {
        content: {
          'application/json': {
            schema: LoginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login realizado com sucesso',
        content: {
          'application/json': {
            schema: AuthResponseSchema,
          },
        },
      },
      400: {
        description: 'Dados inválidos - falha na validação do input',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
          },
        },
      },
      401: {
        description: 'Credenciais inválidas - email ou senha incorretos',
        content: {
          'application/json': {
            schema: InvalidCredentialsErrorSchema,
          },
        },
      },
    },
  });

  // POST /auth/request-reset
  registry.registerPath({
    method: 'post',
    path: AUTH_ROUTES_OPENAPI.REQUEST_RESET,
    tags: ['Auth'],
    summary: 'Solicitar reset de senha',
    description: 'Envia um código de reset para o email do usuário. O código expira em 15 minutos.',
    request: {
      body: {
        content: {
          'application/json': {
            schema: RequestResetPasswordInput,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Email de reset enviado (retorna sucesso mesmo se email não existir por segurança)',
        content: {
          'application/json': {
            schema: MessageResponseSchema,
          },
        },
      },
      400: {
        description: 'Dados inválidos - email mal formatado',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
          },
        },
      },
    },
  });

  // POST /auth/reset-password
  registry.registerPath({
    method: 'post',
    path: AUTH_ROUTES_OPENAPI.RESET_PASSWORD,
    tags: ['Auth'],
    summary: 'Resetar senha',
    description: 'Redefine a senha do usuário usando o código enviado por email',
    request: {
      body: {
        content: {
          'application/json': {
            schema: ResetPasswordInput,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Senha redefinida com sucesso',
        content: {
          'application/json': {
            schema: MessageResponseSchema,
          },
        },
      },
      400: {
        description: 'Código inválido, expirado ou dados mal formatados',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
          },
        },
      },
      404: {
        description: 'Usuário não encontrado',
        content: {
          'application/json': {
            schema: NotFoundErrorSchema,
          },
        },
      },
    },
  });

  // POST /auth/set-password
  registry.registerPath({
    method: 'post',
    path: AUTH_ROUTES_OPENAPI.SET_PASSWORD,
    tags: ['Auth'],
    summary: 'Definir senha',
    description: `Define uma nova senha para usuários que se registraram via OAuth.
    
**Requer autenticação:** Token JWT válido no header Authorization.

**Casos de uso:**
- Usuário criou conta via Google/Spotify e quer definir senha para login tradicional
- Usuário quer alterar senha existente`,
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: SetPasswordInput,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Senha definida com sucesso',
        content: {
          'application/json': {
            schema: MessageResponseSchema,
          },
        },
      },
      400: {
        description: 'Senha não atende aos requisitos de segurança',
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
    },
  });

  // POST /auth/request-access
  registry.registerPath({
    method: 'post',
    path: AUTH_ROUTES_OPENAPI.REQUEST_ACCESS,
    tags: ['Auth'],
    summary: 'Solicitar acesso antecipado',
    description: 'Registra interesse para acesso antecipado à plataforma',
    request: {
      body: {
        content: {
          'application/json': {
            schema: RequestAccessSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Solicitação registrada com sucesso',
        content: {
          'application/json': {
            schema: MessageResponseSchema,
          },
        },
      },
      400: {
        description: 'Dados inválidos',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
          },
        },
      },
    },
  });

  // GET /auth/{provider}
  registry.registerPath({
    method: 'get',
    path: AUTH_ROUTES_OPENAPI.OAUTH_START,
    tags: ['Auth'],
    summary: 'Iniciar fluxo OAuth',
    description: `Redireciona o usuário para o provedor OAuth (Google ou Spotify).

**Parâmetro \`state\` (Segurança CSRF):**

O parâmetro \`state\` é **obrigatório** quando \`method=connect\` e contém:
- Dados codificados em **Base64** com estrutura JSON
- Token JWT do usuário autenticado
- Timestamp para expiração (válido por 5 minutos)

**Estrutura interna do state:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "timestamp": 1736524800000,
  "returnTo": "/dashboard"
}
\`\`\`

**Importante:** O state previne ataques de CSRF e Session Fixation. 
Nunca reutilize um state - gere um novo para cada fluxo OAuth.`,
    request: {
      params: z.object({
        provider: z.enum(['google', 'spotify']).openapi({
          description: 'Provedor OAuth',
          example: 'google',
        }),
      }),
      query: OAuthQuerySchema.openapi({
        description: 'Parâmetros do fluxo OAuth',
      }),
    },
    responses: {
      302: {
        description: 'Redirecionamento para página de login do provedor OAuth',
      },
      400: {
        description: 'Provedor inválido ou state ausente quando method=connect',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
          },
        },
      },
    },
  });

  // GET /auth/{provider}/callback
  registry.registerPath({
    method: 'get',
    path: AUTH_ROUTES_OPENAPI.OAUTH_CALLBACK,
    tags: ['Auth'],
    summary: 'Callback OAuth',
    description: `Endpoint de callback após autenticação OAuth. O provedor redireciona para cá após o usuário autorizar.

**Validação do \`state\`:**
- Decodifica o Base64 para obter o JSON
- Verifica se o timestamp não expirou (máximo 5 minutos)
- Valida o token JWT embutido
- Compara com o state original enviado

**Fluxo de segurança:**
1. Frontend inicia OAuth com state gerado
2. Usuário autoriza no provedor
3. Provedor redireciona com \`code\` e \`state\`
4. Backend valida state antes de trocar code por tokens
5. Se state inválido → rejeita (previne CSRF)

**Possíveis redirecionamentos:**
- Sucesso em login/register: \`/dashboard?token=...\`
- Sucesso em connect: URL do \`returnTo\` no state
- Erro: \`/login?error=...\``,
    request: {
      params: z.object({
        provider: z.enum(['google', 'spotify']).openapi({
          description: 'Provedor OAuth',
          example: 'google',
        }),
      }),
      query: z.object({
        code: z.string().openapi({
          description: 'Código de autorização OAuth retornado pelo provedor',
          example: '4/0AX4XfWh...',
        }),
        state: z.string().openapi({
          description: 'State original codificado em Base64 para validação CSRF',
          example: 'eyJ0b2tlbiI6Ii4uLiIsInRpbWVzdGFtcCI6MTczNjUyNDgwMDAwMH0=',
        }),
      }),
    },
    responses: {
      302: {
        description: 'Redirecionamento após autenticação bem-sucedida',
      },
      400: {
        description: 'Código OAuth inválido, state expirado ou CSRF detectado',
        content: {
          'application/json': {
            schema: ValidationErrorSchema,
          },
        },
      },
      500: {
        description: 'Falha na troca do código por tokens com o provedor',
        content: {
          'application/json': {
            schema: InternalErrorSchema,
          },
        },
      },
    },
  });
}
