import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './openApiRegistry';

// Funções de registro explícitas (sem side-effects)
import { registerAuthDocs } from './definitions/auth.docs';
import { registerPlaylistDocs } from './definitions/playlist.docs';
import { registerSyncDocs } from './definitions/sync.docs';
import { registerUserDocs } from './definitions/user.docs';

export function generateOpenApiDocument() {
  // Registro explícito de todas as definições
  // Ordem determinística e carregamento controlado
  registerAuthDocs(registry);
  registerUserDocs(registry);
  registerPlaylistDocs(registry);
  registerSyncDocs(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);

  const isDev = process.env.NODE_ENV === 'dev';

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Harmonia.io API',
      version: '1.0.0',
      description: 'API para sincronização de playlists entre YouTube Music e Spotify',
      contact: {
        name: 'Harmonia.io Team',
        email: 'thiago@gritti.dev.br',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: isDev
      ? [
          {
            url: 'http://localhost:3000',
            description: 'Servidor de desenvolvimento',
          },
        ]
      : [
          {
            url: 'https://api.harmonia.io',
            description: 'Servidor de produção',
          },
        ],
    tags: [
      { name: 'Auth', description: 'Autenticação e registro de usuários' },
      { name: 'User', description: 'Gerenciamento de dados do usuário' },
      { name: 'Playlist', description: 'Gerenciamento de playlists' },
      { name: 'Sync', description: 'Sincronização de playlists entre serviços' },
    ],
  });
}
