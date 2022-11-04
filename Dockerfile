FROM node:lts-slim AS proddeps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit dev

FROM node:lts-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-slim as dev
WORKDIR /app
CMD ["npm", "run", "start:watch"]

FROM node:lts-slim as prod
WORKDIR /app
COPY package.json .
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
CMD ["node", "/app/dist/index.js"]
