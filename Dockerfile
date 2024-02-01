ARG NODE_VERSION=21.6.1-alpine

FROM node:${NODE_VERSION} as base_version

EXPOSE 3000

RUN mkdir -p /opt/app && \
    addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --ingroup appuser fastify -h /opt/app && \
    chown -R fastify:appuser /opt/app

# Development stage
FROM base_version as development
ENV NODE_ENV development
WORKDIR /opt/app
COPY --chown=fastify:appuser package*.json ./
USER fastify
RUN npm install
COPY --chown=fastify:appuser . .
RUN npm run build
CMD npm run migrate:fresh && npm run start:dev

# Test stage
FROM base_version as test
ENV NODE_ENV test
WORKDIR /opt/app
COPY --chown=fastify:appuser package*.json ./
USER fastify
RUN npm install
COPY --chown=fastify:appuser . .
RUN npm run build
CMD npm run migrate:up && npm run migrate:seed

# Production stage
FROM base_version as production
ENV NODE_ENV production
WORKDIR /opt/app
COPY --chown=fastify:appuser package*.json ./
USER fastify
RUN npm install
COPY --chown=fastify:appuser . .
RUN npm run build
CMD npm run start

