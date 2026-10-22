# syntax=docker/dockerfile:1

# ---- deps: install node_modules once, cached on package-lock ----
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: produce the standalone server ----
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the browser bundle at build time, so they
# MUST be set now — a runtime `-e` would be too late and the client would call
# `undefined/...`. Override per environment with --build-arg. Server-only vars
# (SIGN_API_INTERNAL_URL) are read at request time, so they are NOT set here.
ARG NEXT_PUBLIC_API_BASE_URL=https://api.clarisign.site
ARG NEXT_PUBLIC_FAST_API_BASE_URL=https://py.clarisign.site
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_FAST_API_BASE_URL=$NEXT_PUBLIC_FAST_API_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runner: minimal image, non-root ----
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Server-only, read at request time by the auth Server Actions. In a container
# 127.0.0.1 is the container itself — point this at the host or the sign-api
# service. Override at `docker run` with -e SIGN_API_INTERNAL_URL=...
ENV SIGN_API_INTERNAL_URL=http://host.docker.internal:8081

# Next's standalone output already contains a trimmed node_modules + server.js.
# public/ and .next/static are not part of it and must be copied separately.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
