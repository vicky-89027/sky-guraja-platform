# Multi-stage Dockerfile for Sri Krishna Yadav Youth Guraja Platform
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Build Client Internal App
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client/ ./client/
RUN cd client && npm run build

# 2. Build Public Website
COPY public-website/package*.json ./public-website/
RUN cd public-website && npm ci
COPY public-website/ ./public-website/
RUN cd public-website && npm run build

# 3. Setup Server
COPY server/package*.json ./server/
RUN cd server && npm ci
COPY server/ ./server/
RUN cd server && npm run build

# Production Runtime Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/public-website/dist ./public-website/dist

EXPOSE 5000

WORKDIR /app/server
CMD ["node", "dist/index.js"]
