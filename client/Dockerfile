FROM node:18.12.1-alpine as deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

FROM node:18.12.1-alpine as development

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM node:18.12.1-alpine as builder

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

FROM node:18.12.1-alpine as production

WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]