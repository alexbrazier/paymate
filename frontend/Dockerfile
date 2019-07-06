FROM nginx:1.17.0-alpine

RUN apk add --no-cache dumb-init bash
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
