import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './openApiRegistry';

import './definitions/auth.docs';
import './definitions/playlist.docs';
import './definitions/sync.docs';
import './definitions/user.docs';

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

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
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
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
