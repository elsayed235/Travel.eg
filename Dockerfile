# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — build
#
# Produces two things into dist/: the Vite client bundle, and server.cjs, an
# esbuild bundle of server.ts. That bundle is built with --packages=external,
# so it still require()s node_modules at runtime and the runtime stage below
# must carry production dependencies. It is not self-contained.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Dependencies are copied and installed on their own so this layer is reused
# whenever only source changed — which is almost every build.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_-prefixed variables at build time rather than reading them
# at runtime, so the Maps key has to be present here to reach the client.
# Absent, the app builds and runs with the map surfaces degraded.
ARG VITE_GOOGLE_MAPS_API_KEY=""
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

RUN npm run build

# Reinstall with dev dependencies pruned, for copying into the runtime stage.
RUN npm ci --omit=dev

# ---------------------------------------------------------------------------
# Stage 2 — runtime
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# tini reaps zombies and forwards SIGTERM, so Cloud Run's shutdown signal
# actually reaches Node instead of being swallowed by PID 1.
RUN apk add --no-cache tini

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist        ./dist
COPY --from=build /app/package.json ./package.json

# Read at boot by runMigrationsAndSeed(). importDahabLocalCommerce() throws
# "Master dataset not found" when dahab_local_commerce.json is absent and
# nothing catches it, so omitting these files means the container will not start.
COPY --from=build /app/data ./data

# Read by PostgresPersistenceAdapter.initializeSchema() via a process.cwd()
# path. Only needed on the migration path, but it is 16 kB and its absence
# would surface as a runtime throw rather than a build error.
COPY --from=build /app/server/db/sql ./server/db/sql

# The JSON adapter writes data/dahab_db.json, data/locks/ and
# fencing_sequence.seq, so the node user must own that directory.
#
# NOTE: this is container-local and therefore EPHEMERAL. Every restart starts
# from the seeded state and loses bookings, users and ledger entries. Until
# PostgresPersistenceAdapter.save() is implemented, mount a volume here or
# accept that the store is disposable — and run exactly one instance, because
# the JSON store is a single-writer design.
RUN mkdir -p /app/data/locks && chown -R node:node /app/data

USER node

# Cloud Run and most PaaS hosts inject the real port; server.ts reads PORT and
# falls back to 3000. EXPOSE is documentation, not a binding.
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.cjs"]
