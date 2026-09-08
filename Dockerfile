FROM node:22.22-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

FROM base AS build
# package.json is needed here so corepack honours the pinned pnpm version
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --frozen-lockfile --prefer-offline
RUN pnpm build
# strip devDependencies so the prod stage gets a lean node_modules
RUN pnpm prune --prod

FROM node:22.22-slim AS prod
WORKDIR /app
COPY package.json .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
CMD ["node", "/app/dist/index.js"]
