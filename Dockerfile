FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
RUN npm install --global pnpm@10.34.9
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM dependencies AS builder
COPY . .
ARG NEXT_PUBLIC_APP_URL=https://igiraprovisoire.rw
ARG NEXT_PUBLIC_SITE_URL=https://home.igiraprovisoire.rw
ARG NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=false
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN groupadd --gid 1001 nextjs && useradd --uid 1001 --gid nextjs --no-create-home nextjs
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=4s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/healthz',{signal:AbortSignal.timeout(2500)}).then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
