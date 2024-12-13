FROM node:20-alpine AS base

RUN apk add --no-cache openssl

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY . .

RUN corepack enable

RUN pnpm install --frozen-lockfile
RUN pnpm db:generate
RUN pnpm build
RUN pnpm prune --prod

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/public /app/public
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono

EXPOSE 3000

CMD ["node", "/app/dist/index.cjs"]
