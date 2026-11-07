FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @harmonia/landing --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
RUN npm ci

COPY --from=pruner /app/out/full/ .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DASHBOARD_URL
ENV NEXT_PUBLIC_DASHBOARD_URL=$NEXT_PUBLIC_DASHBOARD_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx turbo run build --filter=@harmonia/landing...

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/public ./apps/landing/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/static ./apps/landing/.next/static

USER nextjs

EXPOSE 3002

CMD ["node", "apps/landing/server.js"]

