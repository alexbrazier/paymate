FROM node:10.16.0-alpine

WORKDIR /usr/local/app
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY api/package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY api/dist .
COPY frontend/build public

EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["yarn", "start:prod"]
