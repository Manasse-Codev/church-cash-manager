# ── Étape de Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# En production, VITE_API_URL est vide pour que les appels
# soient relatifs au même domaine (Nginx fera le proxy)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Étape de Production (Nginx) ──────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copier la config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
