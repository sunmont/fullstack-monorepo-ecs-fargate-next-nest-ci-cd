# Multi-stage build for production
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ openssl

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build shared package
RUN pnpm --filter @fullstack-monorepo/shared build

# Build backend
RUN pnpm --filter backend build

# Remove dev dependencies
RUN pnpm prune --prod

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache curl openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/shared/dist ./node_modules/@fullstack-monorepo/shared

# Copy environment file (will be overridden by ECS)
COPY apps/backend/.env.example .env

USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]