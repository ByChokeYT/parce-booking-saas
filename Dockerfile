# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies (Production only for server)
WORKDIR /app/server
RUN npm ci --only=production

# Generate Prisma Client
COPY server/prisma ./prisma
RUN npx prisma generate

# Application stage
FROM node:18-alpine

WORKDIR /app

# Copy server node_modules and built resources
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/node_modules/.prisma ./server/node_modules/.prisma

# Copy source code
COPY server ./server
COPY package.json ./

# Environment configuration
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Start the server
CMD ["node", "server/index.js"]
