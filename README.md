<p align="center">
  <img src="brand/svg/logo-horizontal-on-green.svg" alt="Harmonia Logo" width="460" />
</p>

<p align="center">
  <strong>Sincronização inteligente de playlists do YouTube para o Spotify, com score de confiança e processamento em background.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue.svg" alt="TypeScript" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black.svg" alt="Next.js" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-22+-green.svg" alt="Node.js" /></a>
</p>

---

## 🎨 Identidade Visual & Brand Kit

O projeto conta com uma identidade visual consistente baseada em 5 barras de equalizador e tipografia editorial *Instrument Serif Italic*.

| Token | Hex | Cor | Uso Principal |
|---|---|---|---|
| `--harmonia-lime` | `#d9f27a` | 🟢 Lima Elétrico | Destaques, botões primários, logo em fundo escuro |
| `--harmonia-green` | `#0b3d24` | 🌲 Verde Floresta | Fundo escuro de alto contraste, superfícies de destaque |

Todos os vetores (SVG), versões raster (PNG), ícones PWA e favicons estão disponíveis no diretório [`brand/`](brand/). Componentes React prontos para uso em `@harmonia/ui` (`HarmoniaLogo`, `HarmoniaMark`).

---

## Visão Geral

**Harmonia.io** é uma plataforma open-source para sincronização de playlists entre YouTube e Spotify. O projeto é auto-hospedável, prioriza privacidade, possui arquitetura limpa e escalável, processamento assíncrono via filas, autenticação OAuth segura e uma interface web moderna.

### Principais Funcionalidades

- Sincronização unidirecional (YouTube -> Spotify)
- Login seguro via OAuth 2.0 (Google/Spotify)
- Processamento assíncrono com BullMQ + Redis
- Interface web Next.js 15 + shadcn/ui
- Arquitetura Clean Architecture + DDD
- Deploy rápido via Docker
- Monitoramento de jobs (Bull Board)

---

## Estrutura do Projeto

Monorepo organizado com Turborepo:

```
harmonia.io/
├── apps/
│   ├── api/        # Backend (Express + TypeScript)
│   └── web/        # Frontend (Next.js 15)
├── packages/
│   ├── shared/     # Tipos e schemas compartilhados
│   ├── database/   # Prisma schema
│   └── config-*    # Configurações
└── turbo.json      # Pipeline de tasks
```

Arquitetura baseada em Clean Architecture:

- **Domain Layer**: Entidades e value objects puros
- **Application Layer**: Use cases e interfaces
- **Infrastructure Layer**: Adapters concretos (DB, OAuth, Queue)
- **Dependency Injection**: Container central

---

## Como rodar

### Pré-requisitos

```bash
node -v   # >= 18.0.0
npm -v    # >= 7.0.0
docker -v # >= 20.0.0
```

### Instalação rápida

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

Acesse:

- **Web App**: [http://localhost:3001](http://localhost:3001)
- **API**: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Stack Tecnológica

### Backend & Filas

<p>
  <img src="https://img.shields.io/badge/Node.js_22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/BullMQ-CC3534?style=for-the-badge&logo=redis&logoColor=white" alt="BullMQ" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
</p>

| Tecnologia | Badge | Papel / Descrição |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | `v22+` | Runtime JavaScript assíncrono com performance nativa |
| [TypeScript](https://www.typescriptlang.org/) | `v5.x` | Tipagem estática rigorosa ponta a ponta |
| [Express](https://expressjs.com/) | `API Core` | Framework HTTP modular e controle de middlewares |
| [Prisma](https://www.prisma.io/) | `ORM` | Modelagem, migrações automatizadas e queries no PostgreSQL |
| [BullMQ](https://docs.bullmq.io/) | `Job Queue` | Gerenciamento de filas assíncronas com retries automáticos |
| [Redis](https://redis.io/) | `Broker` | Mensageria em memória para filas e cache de rate-limits |
| [JWT](https://jwt.io/) | `Auth` | Sessões stateless seguras com criptografia |
| [Zod](https://zod.dev/) | `Schema` | Validação estrita de contratos de entrada e saída |

### Frontend & Experiência

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Nextra_Docs-000000?style=for-the-badge&logo=markdown&logoColor=white" alt="Nextra" />
</p>

| Tecnologia | Badge | Papel / Descrição |
| --- | --- | --- |
| [Next.js](https://nextjs.org/) | `v16 Turbopack` | App Router, Server Components e compilação instantânea |
| [React](https://react.dev/) | `v19` | Motor declarativo e reconciliação concorrente |
| [Tailwind CSS](https://tailwindcss.com/) | `v4` | Estilização utilitária com `@theme` inline |
| [shadcn/ui](https://ui.shadcn.com/) | `Design System` | Componentes acessíveis customizados com tokens da marca |
| [Framer Motion](https://www.framer.com/motion/) | `GPU FX` | Animações por caractere, transição de slides e glide |
| [Nextra](https://nextra.site/) | `Docs` | Documentação técnica com visual limpo e busca nativa |

### Provedores & Integrações

<p>
  <img src="https://img.shields.io/badge/YouTube_Data_API_v3-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube Data API" />
  <img src="https://img.shields.io/badge/Spotify_Web_API-1ED760?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify API" />
  <img src="https://img.shields.io/badge/Google_OAuth_2.0-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth" />
</p>

| Provedor | Badge | Papel / Descrição |
| --- | --- | --- |
| [YouTube Data API](https://developers.google.com/youtube/v3) | `Ingestão` | Varredura de playlists, extração de títulos e canais |
| [Spotify Web API](https://developer.spotify.com/documentation/web-api) | `Sincronização` | Busca inteligente com fuzzy match e inserção de faixas |
| [Google Cloud OAuth](https://cloud.google.com/) | `Permissões` | Fluxo de consentimento OAuth seguro com escopo mínimo |

### Infraestrutura & DevOps

<p>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Turborepo-000000?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
</p>

| Ferramenta | Badge | Papel / Descrição |
| --- | --- | --- |
| [PostgreSQL](https://www.postgresql.org/) | `DB` | Persistência relacional com tokens cifrados via AES-256 |
| [Redis](https://redis.io/) | `Memória` | Backing store de baixa latência para fila do BullMQ |
| [Docker & Compose](https://www.docker.com/) | `Container` | Orquestração reproduzível para deploy e self-hosting |
| [Turborepo](https://turbo.build/) | `Monorepo` | Pipeline de build paralelo com cache de tarefas |

---

## Arquitetura

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

## Configuração OAuth

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
http://localhost:3000/
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

**GET** `/auth/google?intent=login` - OAuth Google (redireciona)

**GET** `/auth/spotify?intent=login` - OAuth Spotify (redireciona)

```bash
Authorization: Bearer {token}
```

#### Sincronização

**POST** `/sync/playlist` - Sincronizar playlist

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
npm run build:shared     # Build apenas do Shared
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
docker compose up --build -d
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

## 🐛 Troubleshooting

### `redirect_uri_mismatch`

- Verifique se o URI no `.env` é **exatamente** igual ao configurado no OAuth provider
- Use `http://127.0.0.1:3000` (não use `localhost`)
- Sem `/` no final da URL

### `Module not found: @harmonia/shared`

```bash
npm install
npm run db:generate
```

### Erros de conexão com Docker

```bash
docker compose down
docker compose up --build -d
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

- 🌐 Website: [gritti.dev](https://gritti.dev.br)
- 📧 Email: [thiago@gritti.dev.br](mailto:thiago@gritti.dev.br)
- 💼 LinkedIn: [@thiagogritti](https://linkedin.com/in/thiago-gritti)
- 🐙 GitHub: [@thiagoDOTjpeg](https://github.com/thiagoDOTjpeg)
- 📞 Discord: [@harmonia.io](https://discord.gg/3gYajwJuXA)

---

## ⭐ Star o projeto!

Se você achou este projeto útil, considere dar uma ⭐ no GitHub! Isso ajuda mais pessoas a descobrirem o Harmonia.io.

---

<div align="center">

**Feito com ❤️ usando Clean Architecture + TypeScript**

[Website](https://harmonia.io) • [Documentação](#-api-documentation) • [API Docs](#-api-documentation) • [Contribuir](#-contribuindo)

</div>
