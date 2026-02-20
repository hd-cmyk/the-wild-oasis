# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Install serve to run the built app
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 5173
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]
