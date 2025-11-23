# 🎵 Harmonia.io

> Sincronize suas playlists entre YouTube e Spotify de forma automática, privada e gratuita.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)

**Harmonia.io** é uma solução **open-source** para sincronizar suas playlists do YouTube para o Spotify. Auto-hospedável, com processamento em background via filas, autenticação OAuth segura e interface web moderna.

---

## ✨ Features

- 🔄 **Sincronização Bidirecional** - YouTube ↔ Spotify (em desenvolvimento)
- 🔐 **OAuth 2.0** - Login seguro com Google e Spotify
- ⚡ **Processamento Assíncrono** - Sistema de filas com BullMQ + Redis
- 🎨 **Interface Moderna** - Dashboard Next.js 15 com shadcn/ui
- 🏗️ **Clean Architecture** - Código organizado e escalável
- 🐳 **Docker Ready** - Deploy em 5 minutos
- 🔒 **Privacidade Total** - Seus dados, sua infraestrutura
- 📊 **Monitoramento** - Bull Board para acompanhar sincronizações

---

## 🖼️ Screenshots

### Dashboard

<!-- TODO: Adicionar screenshot do dashboard -->

### Gerenciamento de Playlists

<!-- TODO: Adicionar screenshot de playlists -->

---

## 🚀 Quick Start

### Pré-requisitos

```bash
node -v   # >= 18.0.0
npm -v    # >= 7.0.0
docker -v # >= 20.0.0
```

### Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/thiagoDOTjpeg/harmonia.io.git
cd harmonia.io

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais OAuth

# 4. Inicie o Docker (PostgreSQL + Redis)
cd apps/api && docker-compose up -d && cd ../..

# 5. Configure o banco de dados
npm run db:generate && npm run db:push

# 6. Inicie a aplicação
npm run dev
```

🎉 Acesse:

- **Web App**: [http://localhost:3001](http://localhost:3001)
- **API**: [http://localhost:3000](http://localhost:3000)
- **Queue Monitor**: [http://localhost:3000/queues](http://localhost:3000/queues)

---

## 📦 Stack Tecnológica

### Backend

| Tecnologia                                      | Descrição              |
| ----------------------------------------------- | ---------------------- |
| [Node.js 22+](https://nodejs.org/)              | Runtime JavaScript     |
| [TypeScript 5](https://www.typescriptlang.org/) | Type Safety            |
| [Express](https://expressjs.com/)               | Web Framework          |
| [Prisma](https://www.prisma.io/)                | ORM para PostgreSQL    |
| [BullMQ](https://docs.bullmq.io/)               | Sistema de Filas       |
| [JWT](https://jwt.io/)                          | Autenticação Stateless |
| [Zod](https://zod.dev/)                         | Validação de Schemas   |

### Frontend

| Tecnologia                                    | Descrição        |
| --------------------------------------------- | ---------------- |
| [Next.js 15](https://nextjs.org/)             | React Framework  |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety      |
| [Tailwind CSS](https://tailwindcss.com/)      | Styling          |
| [shadcn/ui](https://ui.shadcn.com/)           | Componentes      |
| [Zustand](https://zustand-demo.pmnd.rs/)      | State Management |

### Infraestrutura

| Tecnologia                                | Descrição       |
| ----------------------------------------- | --------------- |
| [PostgreSQL](https://www.postgresql.org/) | Banco de Dados  |
| [Redis](https://redis.io/)                | Cache + Filas   |
| [Docker](https://www.docker.com/)         | Containerização |
| [Turborepo](https://turbo.build/)         | Monorepo        |

---

## 🏗️ Arquitetura

```
harmonia.io/
├── apps/
│   ├── api/                      # Backend (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── application/      # Use Cases (regras de negócio)
│   │   │   ├── domain/           # Entidades + Value Objects
│   │   │   ├── infrastructure/   # Adaptadores (DB, OAuth, Queue)
│   │   │   └── main/             # Entry Points (server + worker)
│   │   └── docker-compose.yml    # PostgreSQL + Redis
│   │
│   └── web/                      # Frontend (Next.js 15)
│       ├── app/                  # Pages (App Router)
│       ├── components/           # UI Components
│       └── hooks/                # Custom Hooks
│
├── packages/
│   ├── shared/                   # Tipos + Schemas Compartilhados
│   ├── database/                 # Prisma Schema
│   └── config-typescript/        # Configurações TS
│
└── turbo.json                    # Pipeline de Tasks
```

### Clean Architecture

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design**:

- **Domain Layer**: Entidades puras sem dependências externas
- **Application Layer**: Use Cases e interfaces (ports)
- **Infrastructure Layer**: Implementações concretas (adapters)
- **Dependency Injection**: Container no `main/container.ts`

---

## 🔐 Configuração OAuth

### Spotify

1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie um novo aplicativo
3. Adicione em **Redirect URIs**:
   ```
   http://localhost:3000/api/auth/spotify/login/callback
   http://localhost:3000/api/auth/spotify/register/callback
   ```
4. Copie o **Client ID** e **Client Secret** para o `.env`:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/login/callback
   ```

### Google (YouTube)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crie um novo projeto
3. Crie **OAuth 2.0 Client ID** (Web application)
4. Adicione em **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/google/login/callback
   http://localhost:3000/api/auth/google/register/callback
   ```
5. Ative a **YouTube Data API v3**
6. Copie as credenciais para o `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/login/callback
   ```

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints Principais

#### Autenticação

**POST** `/auth/register` - Criar conta

```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**POST** `/auth/login` - Fazer login

```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**GET** `/auth/google/login` - OAuth Google (redireciona)

**GET** `/auth/spotify/login` - OAuth Spotify (redireciona)

**GET** `/auth/me` - Obter usuário autenticado

```bash
Authorization: Bearer {token}
```

#### Sincronização

**POST** `/sync` - Sincronizar playlist

```json
{
  "youtubePlaylistId": "PLxxxxxxxxxxxxx"
}
```

**GET** `/sync/playlists` - Listar playlists sincronizadas

**GET** `/sync/:jobId` - Status de sincronização

**POST** `/sync/:playlistId/resync` - Re-sincronizar

📚 [Documentação Completa da API](#-api-endpoints)

---

## 🛠️ Scripts

### Desenvolvimento

```bash
npm run dev              # Inicia API + Web em paralelo
npm run dev:api          # Apenas a API (porta 3000)
npm run dev:web          # Apenas o Web App (porta 3001)
npm run worker           # Worker de filas (necessário para sincronizar)
```

### Build

```bash
npm run build            # Build de todo o monorepo
npm run build:api        # Build apenas da API
npm run build:web        # Build apenas do Web
```

### Database

```bash
npm run db:generate      # Gera Prisma Client
npm run db:push          # Aplica schema no banco (dev)
npm run db:migrate       # Cria migration (produção)
```

### Utilitários

```bash
npm run lint             # Lint todo o projeto
npm run format           # Formata com Prettier
npm run clean            # Limpa builds
```

---

## 🐳 Deploy com Docker

### Desenvolvimento

```bash
cd apps/api
docker-compose up -d
```

### Produção

```bash
# Build da imagem
docker build -t harmonia-api -f apps/api/Dockerfile .

# Rodar em produção
docker-compose -f docker-compose.prod.yml up -d
```

### Variáveis de Ambiente (Produção)

```env
NODE_ENV=production
BASE_URL=https://harmonia.io
DATABASE_URL="postgresql://user:pass@host:5432/harmonia"
REDIS_HOST=redis-production-host
REDIS_PORT=6379
JWT_SECRET=<sua-chave-secreta-256-bits>
JWT_REFRESH_SECRET=<sua-chave-secreta-256-bits>
```

---

## 🤝 Contribuindo

Contribuições são **muito bem-vindas**! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
refactor: refatora código
test: adiciona testes
```

---

## 📝 Roadmap

- [x] Autenticação OAuth (Google + Spotify)
- [x] Sincronização YouTube → Spotify
- [x] Interface Web (Dashboard)
- [x] Sistema de Filas (BullMQ)
- [ ] Sincronização Spotify → YouTube
- [ ] Sincronização automática (cron jobs)
- [ ] Planos de assinatura
- [ ] Suporte a Apple Music
- [ ] Aplicativo Mobile (React Native)
- [ ] Notificações em tempo real (WebSockets)

---

## 🐛 Troubleshooting

### `redirect_uri_mismatch`

- Verifique se o URI no `.env` é **exatamente** igual ao configurado no OAuth provider
- Use `http://localhost:3000` (não use `127.0.0.1`)
- Sem `/` no final da URL

### `Module not found: @harmonia/shared`

```bash
npm install
npm run db:generate
```

### Erros de conexão com Docker

```bash
cd apps/api
docker-compose down
docker-compose up -d
```

### Jobs não processando

- Certifique-se de que o worker está rodando: `npm run worker`
- Verifique os logs do Redis: `docker logs harmonia-redis`
- Acesse o Bull Board: [http://localhost:3000/queues](http://localhost:3000/queues)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📧 Contato

**Thiago Gritti**

- 🌐 Website: [thiagogritti.dev](https://thiagogritti.dev)
- 📧 Email: [contato@harmonia.io](mailto:contato@harmonia.io)
- 💼 LinkedIn: [@thiagogritti](https://linkedin.com/in/thiagogritti)
- 🐙 GitHub: [@thiagoDOTjpeg](https://github.com/thiagoDOTjpeg)

---

## ⭐ Star o projeto!

Se você achou este projeto útil, considere dar uma ⭐ no GitHub! Isso ajuda mais pessoas a descobrirem o Harmonia.io.

---

<div align="center">

**Feito com ❤️ usando Clean Architecture + TypeScript**

[Website](https://harmonia.io) • [Documentação](#-api-documentation) • [API Docs](#-api-documentation) • [Contribuir](#-contribuindo)

</div>
