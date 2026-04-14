# backend/Dockerfile

# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app

# --- Dependencies ---
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci --omit=dev


# --- Prisma ---
COPY prisma ./prisma
RUN npx prisma generate

# --- Application source ---
COPY src ./src

# --- Runtime ---
EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "src/app.js"]
