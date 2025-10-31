# Harmonia.io API

API Node.js/TypeScript para sincronizar playlists entre YouTube e Spotify. Suporta autenticação via:

- Email e senha (JWT)
- Spotify OAuth 2.0
- Google/YouTube OAuth 2.0

## Stack

- Node.js 18+ (fetch nativo)
- Express
- Prisma + PostgreSQL
- JWT (jsonwebtoken)
- Bcrypt (bcryptjs)
- OAuth (Spotify e Google)

## Requisitos

- Node.js 18 ou superior
- PostgreSQL em execução
- Credenciais de desenvolvedor no Spotify e Google

## Configuração

1. Instalar dependências

```sh
npm install
```

2. Variáveis de ambiente (.env)
   Crie um arquivo `.env` na raiz com as chaves abaixo (sem expor segredos no repositório):

```env
DATABASE_URL="postgresql://<user>:<pass>@localhost:5432/harmonia?schema=public"

PORT=3000
JWT_SECRET="<uma_chave_bem_secreta>"

# Spotify OAuth
SPOTIFY_CLIENT_ID="<seu_client_id>"
SPOTIFY_CLIENT_SECRET="<seu_client_secret>"
SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/auth/spotify/callback"

# Google/YouTube OAuth
GOOGLE_CLIENT_ID="<seu_client_id>"
GOOGLE_CLIENT_SECRET="<seu_client_secret>"
GOOGLE_REDIRECT_URI="http://127.0.0.1:3000/auth/google/callback"
```

Importante: o Redirect URI deve ser exatamente igual no provedor (Spotify/Google) e no .env (ex.: usar sempre 127.0.0.1 ou sempre localhost).

3. Banco de dados (Prisma)

```sh
npx prisma generate
npx prisma migrate dev -n init
# (se já houver migrações, apenas:)
npx prisma migrate dev
```

Opcional (UI do banco):

```sh
npx prisma studio
```

## Executando

Ambiente de desenvolvimento:

```sh
npm run dev
# se não houver script dev:
npx ts-node-dev --respawn src/index.ts
```

Health check:

```sh
curl -i http://127.0.0.1:3000/health
```

## Configurar OAuth

- Spotify

  1. Acesse https://developer.spotify.com/dashboard
  2. Crie um app, adicione o Redirect URI: `http://127.0.0.1:3000/auth/spotify/callback`
  3. Copie Client ID/Secret para o .env

- Google/YouTube
  1. Acesse https://console.cloud.google.com/apis/credentials
  2. Crie OAuth Client (Web application)
  3. Authorized redirect URIs: `http://127.0.0.1:3000/auth/google/callback`
  4. Copie Client ID/Secret para o .env
  5. Ative a API do YouTube Data v3 no projeto

## Endpoints

Base URL (dev): `http://127.0.0.1:3000`

- Registro local (email/senha)

  - POST `/auth/register`
  - Body: `{"email":"user@mail.com","password":"senha123","name":"Opcional"}`
  - 201: `{ token, user }`

- Login local (email/senha)

  - POST `/auth/login`
  - Body: `{"email":"user@mail.com","password":"senha123"}`
  - 200: `{ token, user }`

- Login com Spotify

  - GET `/auth/spotify/login` (redireciona para consentimento)
  - GET `/auth/spotify/callback?code=...&state=...`
  - 200: `{ token, user }`

- Login com Google/YouTube

  - GET `/auth/google/login` (redireciona para consentimento)
  - GET `/auth/google/callback?code=...&state=...`
  - 200: `{ token, user }`

- Rota protegida
  - GET `/me`
  - Header: `Authorization: Bearer <JWT>`
  - 200: `{ id, email, name, spotifyId, googleId }`

## Testes rápidos (curl)

Registro:

```sh
curl -X POST http://127.0.0.1:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","password":"senha123","name":"A"}'
```

Login:

```sh
curl -X POST http://127.0.0.1:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@a.com","password":"senha123"}'
```

Protegido:

```sh
TOKEN="<cole_o_token>"
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:3000/me
```

OAuth (navegador):

- Spotify: http://127.0.0.1:3000/auth/spotify/login
- Google: http://127.0.0.1:3000/auth/google/login

## Estrutura do projeto

```
prisma/
  schema.prisma
  migrations/
src/
  index.ts
  lib/
    auth.ts
    jwt.ts
    password.ts
    prisma.ts
  routes/
    auth.ts
    me.ts
  services/
    google_oauth.ts
    spotify_oauth.ts
    user_auth.ts
```

## Notas e boas práticas

- Garanta que `JWT_SECRET` é forte e diferente por ambiente.
- Em produção, prefira cookies httpOnly/secure para transportar o JWT.
- Mantenha os Redirect URIs idênticos entre provedor e backend (.env).
- Erros comuns:
  - `redirect_uri_mismatch` ou `invalid_grant`: URIs divergentes.
  - `P2002`: e-mail duplicado no registro (violação de unique).

## Licença

Uso interno/educacional. Defina a licença conforme necessário.
