FROM node:22.22-slim AS proddeps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit dev

FROM node:22.22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.22-slim as dev
WORKDIR /app
CMD ["npm", "run", "start:watch"]

FROM node:22.22-slim as prod
WORKDIR /app
COPY package.json .
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
CMD ["node", "/app/dist/index.js"]
