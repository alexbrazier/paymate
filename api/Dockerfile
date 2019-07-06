FROM node:10.15.3-alpine

WORKDIR /usr/local/app
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY package.json dist/yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY dist .

EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["yarn", "start:prod"]
