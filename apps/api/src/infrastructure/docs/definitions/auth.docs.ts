import {
  LoginSchema,
  OAuthQuerySchema,
  RegisterSchema,
  RequestAccessSchema,
  RequestResetPasswordInput,
  ResetPasswordInput,
  SetPasswordInput,
} from '@harmonia/shared';
import { z } from 'zod';
import { registry } from '../openApiRegistry';

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

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
}).openapi('ErrorResponse');

// ==================== REGISTRAR SCHEMAS ====================

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

// ==================== REGISTRAR ROTAS ====================

// POST /auth/register
registry.registerPath({
  method: 'post',
  path: '/auth/register',
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
      description: 'Dados inválidos',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
    409: {
      description: 'Email já cadastrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// POST /auth/login
registry.registerPath({
  method: 'post',
  path: '/auth/login',
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
    401: {
      description: 'Credenciais inválidas',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// POST /auth/request-reset
registry.registerPath({
  method: 'post',
  path: '/auth/request-reset',
  tags: ['Auth'],
  summary: 'Solicitar reset de senha',
  description: 'Envia um código de reset para o email do usuário',
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
      description: 'Email de reset enviado',
      content: {
        'application/json': {
          schema: MessageResponseSchema,
        },
      },
    },
    404: {
      description: 'Email não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// POST /auth/reset-password
registry.registerPath({
  method: 'post',
  path: '/auth/reset-password',
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
      description: 'Código inválido ou expirado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// POST /auth/set-password
registry.registerPath({
  method: 'post',
  path: '/auth/set-password',
  tags: ['Auth'],
  summary: 'Definir senha',
  description: 'Define uma nova senha para usuários que se registraram via OAuth',
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

// POST /auth/request-access
registry.registerPath({
  method: 'post',
  path: '/auth/request-access',
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
      description: 'Solicitação registrada',
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
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// GET /auth/:provider
registry.registerPath({
  method: 'get',
  path: '/auth/{provider}',
  tags: ['Auth'],
  summary: 'Iniciar fluxo OAuth',
  description: 'Redireciona para o provedor OAuth (Google ou Spotify)',
  request: {
    params: z.object({
      provider: z.enum(['google', 'spotify']).openapi({
        description: 'Provedor OAuth',
        example: 'google',
      }),
    }),
    query: OAuthQuerySchema,
  },
  responses: {
    302: {
      description: 'Redirecionamento para provedor OAuth',
    },
    400: {
      description: 'Provedor inválido',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});

// GET /auth/:provider/callback
registry.registerPath({
  method: 'get',
  path: '/auth/{provider}/callback',
  tags: ['Auth'],
  summary: 'Callback OAuth',
  description: 'Endpoint de callback após autenticação OAuth',
  request: {
    params: z.object({
      provider: z.enum(['google', 'spotify']).openapi({
        description: 'Provedor OAuth',
        example: 'google',
      }),
    }),
    query: z.object({
      code: z.string().openapi({
        description: 'Código de autorização OAuth',
      }),
      state: z.string().openapi({
        description: 'Estado para validação CSRF',
      }),
    }),
  },
  responses: {
    302: {
      description: 'Redirecionamento após autenticação bem-sucedida',
    },
    400: {
      description: 'Erro na autenticação OAuth',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
});
