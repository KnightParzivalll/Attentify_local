# Stage 1: Build the Frontend Application
FROM node:23.10.0-alpine3.20 AS builder

# Install pnpm globally (specific version for consistency)
RUN npm install -g pnpm@9.11.0

WORKDIR /app

# Copy only dependency files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# Copy the rest of the source code (including environment file if required)
COPY . .

# Build production assets
# RUN pnpm build
RUN pnpm exec vite build

# Stage 2: Serve the Built Assets with Nginx (Unprivileged)
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Switch to root for setup tasks (will switch back later)
USER root

# Create necessary directories and ensure correct ownership.
# Remove default configuration and content for security purposes.
RUN mkdir -p /tmp /var/cache/nginx /var/run && \
    chown -R nginx:nginx /tmp /var/cache/nginx /var/run /usr/share/nginx/html && \
    rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Security hardening
RUN chown -R nginx:nginx /var/cache/nginx && \
    rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Revert back to non-root for runtime security
USER nginx

# Copy built frontend assets
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
# COPY --chown=nginx:nginx ./dist /usr/share/nginx/html

# Expose the port on which Nginx will serve the content (should match Traefik's configuration)
EXPOSE 8080