FROM node:20.9.0-alpine3.18

WORKDIR /usr/local/app
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init nginx supervisor bash

COPY supervisord.conf /etc/supervisord.conf
COPY stop_supervisor.sh .
COPY nginx /etc/nginx
COPY api/package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY api/dist api
COPY frontend/next.config.js frontend/
COPY frontend/public frontend/public
COPY frontend/.next/standalone/frontend frontend/
COPY frontend/.next/static frontend/.next/static

EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
