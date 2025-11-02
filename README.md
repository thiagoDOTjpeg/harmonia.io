# 🎵 Harmonia.io

Monorepo full-stack para sincronizar playlists do YouTube para o Spotify com autenticação OAuth e processamento de filas.

## 📦 Stack

### Monorepo

- **Turbo** - Build system e task runner
- **npm workspaces** - Gerenciamento de dependências

### Backend (API)

- **Node.js 22+** - Runtime JavaScript
- **TypeScript 5** - Type safety
- **Express** - Web framework
- **Prisma** - ORM para PostgreSQL
- **Bull** - Queue system com Redis
- **JWT** - Autenticação stateless
- **Zod** - Validação de schemas

### Frontend (Web) - Em desenvolvimento

- **Next.js 15** - React framework
- **TypeScript** - Type safety

### Infraestrutura

- **PostgreSQL** - Banco de dados relacional
- **Redis** - Cache e filas
- **Docker Compose** - Orquestração local

## 🏗️ Arquitetura

```
harmonia.io/
├── apps/
│   ├── api/              # Backend Node.js + Express
│   │   ├── src/
│   │   │   ├── application/    # Use cases e portas
│   │   │   ├── domain/         # Entidades e regras de negócio
│   │   │   ├── infrastructure/ # Implementações (DB, OAuth, Queue)
│   │   │   └── main/           # Entry points (server + worker)
│   │   └── docker-compose.yml  # PostgreSQL + Redis
│   └── web/              # Frontend Next.js (futuro)
├── packages/
│   ├── shared/           # Tipos e schemas compartilhados
│   ├── database/         # Prisma schema e client
│   └── config-typescript/# Configurações TypeScript
└── turbo.json            # Pipeline de tasks
```

### Clean Architecture + DDD

- **Domain Layer**: Entidades (`User`, `Track`, `SyncedPlaylist`) e Value Objects (`Email`)
- **Application Layer**: Use Cases (login, sync) e interfaces (ports)
- **Infrastructure Layer**: Implementações concretas (Prisma, OAuth clients, Redis)
- **Main Layer**: Composição de dependências (DI container)

## 🚀 Início Rápido

### 1. Pré-requisitos

```bash
node -v  # >= 18.0.0
npm -v   # >= 7.0.0
docker --version
docker-compose --version
```

### 2. Clonar e instalar

```bash
git clone https://github.com/seu-usuario/harmonia.io.git
cd harmonia.io

# Instalar dependências de todo o monorepo
npm install
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar template
cp .env.example .env

# Editar com suas credenciais
nano .env
```

**`.env`** (raiz do projeto):

```env
# Application
NODE_ENV=development
BASE_URL=http://localhost:3000
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/harmonia?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/login/callback

# Spotify OAuth (https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/login/callback
```

### 4. Iniciar infraestrutura (PostgreSQL + Redis)

```bash
cd apps/api
docker-compose up -d
cd ../..
```

### 5. Configurar banco de dados

```bash
# Gerar Prisma Client
npm run db:generate

# Aplicar migrations
npm run db:push

# (Opcional) Abrir Prisma Studio
cd packages/database
npx prisma studio
```

### 6. Iniciar aplicação

```bash
# Terminal 1: API
npm run dev:api

# Terminal 2: Worker (processamento de filas)
npm run worker
```

Acesse: http://localhost:3000/health

## 🔐 Configurar OAuth

### Spotify

1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie um novo app
3. Em **Settings** → **Redirect URIs**, adicione:
   ```
   http://localhost:3000/api/auth/spotify/login/callback
   http://localhost:3000/api/auth/spotify/register/callback
   ```
4. Copie **Client ID** e **Client Secret** para o `.env`

### Google/YouTube

1. Acesse [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crie um novo projeto ou selecione existente
3. Crie **OAuth 2.0 Client ID** (Web application)
4. Em **Authorized redirect URIs**, adicione:
   ```
   http://localhost:3000/api/auth/google/login/callback
   http://localhost:3000/api/auth/google/register/callback
   ```
5. Ative a **YouTube Data API v3** no projeto
6. Copie **Client ID** e **Client Secret** para o `.env`

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

### Autenticação

#### Registro Local

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}

# Response 201
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nome do Usuário"
  }
}
```

#### Login Local

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}

# Response 200
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

#### OAuth Google

```bash
# 1. Iniciar fluxo (redireciona para Google)
GET /auth/google/login
GET /auth/google/register

# 2. Callback (automático após autorização)
GET /auth/google/login/callback?code=...&state=...

# Response 200
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

#### OAuth Spotify

```bash
# 1. Iniciar fluxo (redireciona para Spotify)
GET /auth/spotify/login
GET /auth/spotify/register

# 2. Callback (automático após autorização)
GET /auth/spotify/login/callback?code=...&state=...

# Response 200
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

#### Refresh Token

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

# Response 200
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Obter Usuário Autenticado

```bash
GET /auth/me
Authorization: Bearer eyJhbGc...

# Response 200
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Nome do Usuário",
  "spotifyId": "spotify-user-id",
  "googleId": "google-user-id",
  "youtubeChannelId": "UCxxxx"
}
```

### Sincronização de Playlists

#### Sincronizar Playlist do YouTube para Spotify

```bash
POST /sync
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "youtubePlaylistId": "PLxxxxxxxxxxxxx"
}

# Response 202 Accepted
{
  "jobId": "sync-uuid-timestamp",
  "status": "queued",
  "message": "Playlist adicionada à fila de sincronização"
}
```

#### Obter Status de Sincronização

```bash
GET /sync/:jobId
Authorization: Bearer eyJhbGc...

# Response 200
{
  "jobId": "sync-uuid-timestamp",
  "status": "completed", // ou "processing", "failed"
  "progress": {
    "currentTrack": 50,
    "totalTracks": 50,
    "syncedTracks": 48,
    "failedTracks": 2,
    "duplicates": 3
  },
  "result": {
    "playlistId": "uuid",
    "spotifyPlaylistId": "spotify-id",
    "spotifyUrl": "https://open.spotify.com/playlist/..."
  }
}
```

#### Listar Playlists Sincronizadas

```bash
GET /sync/playlists
Authorization: Bearer eyJhbGc...

# Response 200
{
  "playlists": [
    {
      "id": "uuid",
      "youtubeTitle": "Minha Playlist",
      "spotifyTitle": "Minha Playlist",
      "youtubeUrl": "https://youtube.com/playlist?list=...",
      "spotifyUrl": "https://open.spotify.com/playlist/...",
      "status": "completed",
      "lastSyncedAt": "2025-11-02T12:00:00Z",
      "createdAt": "2025-11-01T10:00:00Z"
    }
  ]
}
```

#### Re-sincronizar Playlist Existente

```bash
POST /sync/:playlistId/resync
Authorization: Bearer eyJhbGc...

# Response 202 Accepted
{
  "jobId": "sync-uuid-timestamp",
  "status": "queued"
}
```

### Monitoramento de Filas (Bull Board)

```bash
GET /queues
# Acesse no navegador: http://localhost:3000/queues
```

Interface visual para:

- Ver jobs em processamento
- Jobs concluídos/falhados
- Métricas de performance
- Retry manual de jobs

## 🧪 Testes

### Teste com cURL

**Registro:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "senha123",
    "name": "Teste User"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "senha123"
  }'
```

**Rota protegida:**

```bash
TOKEN="seu_token_jwt_aqui"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/me
```

**Sincronizar playlist:**

```bash
TOKEN="seu_token_jwt_aqui"
curl -X POST http://localhost:3000/api/sync \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "youtubePlaylistId": "PLxxxxxxxxxxxxx"
  }'
```

### OAuth (Navegador)

- **Spotify Login**: http://localhost:3000/api/auth/spotify/login
- **Google Login**: http://localhost:3000/api/auth/google/login

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Rodar todos os apps em paralelo
npm run dev:api          # Rodar apenas a API
npm run dev:web          # Rodar apenas o web app
npm run worker           # Rodar o worker de filas

# Build
npm run build            # Build de todo o monorepo
npm run build:api        # Build apenas da API
npm run build:web        # Build apenas do web

# Database
npm run db:generate      # Gerar Prisma Client
npm run db:push          # Aplicar schema no banco (dev)
npm run db:migrate       # Criar migration

# Utilitários
npm run lint             # Lint em todos os packages
npm run format           # Formatar código com Prettier
npm run clean            # Limpar node_modules e builds
npm run check:env        # Verificar carregamento de envs
```

## 🏛️ Design Patterns Utilizados

- **Clean Architecture**: Separação de camadas (domain, application, infrastructure)
- **Dependency Injection**: Container de dependências no `main/container.ts`
- **Repository Pattern**: Abstração de acesso a dados
- **Use Case Pattern**: Lógica de negócio isolada
- **Factory Pattern**: Criação de clientes OAuth
- **Strategy Pattern**: Diferentes estratégias de autenticação
- **Observer Pattern**: Sistema de filas com Bull

## 🔍 Debugging

### Verificar variáveis de ambiente

```bash
npm run check:env
```

### Ver logs do PostgreSQL

```bash
docker logs harmonia-postgres
```

### Ver logs do Redis

```bash
docker logs harmonia-redis
```

### Conectar diretamente ao Redis

```bash
docker exec -it harmonia-redis redis-cli
> KEYS *
> GET "bull:playlist-sync:*"
```

### Acessar PostgreSQL

```bash
docker exec -it harmonia-postgres psql -U postgres -d harmonia
\dt    # Listar tabelas
\d+    # Ver schema
```

## 📝 Troubleshooting

### `redirect_uri_mismatch` (OAuth)

- ✅ Verifique que o URI no `.env` é **exatamente** igual ao registrado no provider
- ✅ Use sempre `http://localhost:3000` OU `http://127.0.0.1:3000` (não misture)
- ✅ Sem barra `/` no final

### `Unique constraint failed` (Prisma)

- ✅ Email já cadastrado - use outro email ou faça login
- ✅ Playlist já sincronizada - use o endpoint de re-sync

### `Module not found: @harmonia/shared`

```bash
npm install
npm run db:generate
```

### Erros de conexão com Redis/PostgreSQL

```bash
cd apps/api
docker-compose down
docker-compose up -d
```

## 🚢 Deploy

### Docker (produção)

```bash
# Build da imagem
docker build -t harmonia-api -f apps/api/Dockerfile .

# Rodar com docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Variáveis de ambiente (produção)

```env
NODE_ENV=production
BASE_URL=https://harmonia.io
DATABASE_URL="postgresql://user:pass@host:5432/harmonia"
REDIS_HOST=redis-production-host
JWT_SECRET=<256-bit-random-key>
# ... outras variáveis
```

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Contato

- **Email**: contato@harmonia.io
- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)

---

Feito com ❤️ usando Clean Architecture + TypeScript
