# ── Étape de Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Générer le client Prisma (DATABASE_URL fictif, nécessaire uniquement pour la génération du client)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Build de l'application NestJS
RUN npm run build

# Supprimer les devDependencies pour réduire la taille de l'image
RUN npm prune --production

# ── Étape de Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
# prisma.config.ts est nécessaire pour prisma migrate deploy
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts

EXPOSE 4000

ENV NODE_ENV=production

# prisma migrate deploy applique les migrations en attente, puis le serveur démarre
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
