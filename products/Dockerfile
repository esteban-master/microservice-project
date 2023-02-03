FROM node:18.12.1-alpine AS development

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm ci

COPY --chown=node:node . .

CMD ["npm", "run", "start:migrate:dev"]

FROM node:18.12.1-alpine AS build

WORKDIR /app

# Copio los package json
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

# Para ejecutar `npm run build`, necesitamos acceso a Nest CLI, que es una dependencia de desarrollo. En la etapa de desarrollo anterior, ejecutamos `npm ci` que instaló todas las dependencias, por lo que podemos copiar el directorio node_modules desde la imagen de desarrollo.
COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .
RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.12.1-alpine AS production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=build /app/prisma ./prisma
COPY --chown=node:node --from=build /app/dist ./dist

CMD ["npm", "run", "start:migrate:prod"]