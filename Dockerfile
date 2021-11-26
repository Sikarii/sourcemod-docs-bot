FROM node:16-slim AS base

WORKDIR /app

COPY tsconfig.json ./
COPY package*.json ./

# Dependencies
FROM base as dependencies
RUN npm install

# App
FROM base AS app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

CMD npm run start
