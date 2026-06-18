# Production Dockerfile for the entire application
FROM node:20-alpine as builder

WORKDIR /build

# Copy both client and server
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install all dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Build server
RUN cd server && npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built server
COPY --from=builder /build/server/dist ./dist
COPY --from=builder /build/server/package*.json ./

# Copy built client to be served by server
COPY --from=builder /build/client/dist/public ./dist/public

# Install production dependencies only
RUN npm ci --only=production

EXPOSE 8000

ENV NODE_ENV=production

CMD ["node", "dist/index.cjs"]
