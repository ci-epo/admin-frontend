# ================================
# 1. Dependencies stage
# ================================
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force

# ================================
# 2. Build stage
# ================================
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Variable obligatoire au build (`src/config/env.ts` lève une erreur si elle est vide). Le navigateur n'appelle jamais
# l'API (Server Actions et middleware seulement) : l'adresse interne convient et rien de public n'est figé dans le code.
# docker/compose.prod.yaml ou le compose de déploiement peut la surcharger.
ARG NEXT_PUBLIC_API_BASE_URL=http://api:3000/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build

# ================================
# 3. Production runner (sortie « standalone » : pas de node_modules complet)
# ================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
