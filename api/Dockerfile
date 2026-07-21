# ── Étape de Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Générer le client Prisma
RUN npx prisma generate

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

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "dist/src/main.js"]
