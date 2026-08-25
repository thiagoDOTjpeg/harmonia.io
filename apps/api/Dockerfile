FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @harmonia/api --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
RUN npm ci

COPY --from=pruner /app/out/full/ .

RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
RUN npx turbo run build --filter=@harmonia/api...

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/packages ./packages
COPY --from=builder --chown=expressjs:nodejs /app/apps/api ./apps/api

USER expressjs

EXPOSE 3000

CMD ["node", "apps/api/dist/main/index.js"]
