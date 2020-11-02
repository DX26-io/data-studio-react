FROM node:12.16.1-alpine As builder

LABEL maintainer="development@dx26.io"

LABEL name="dx26-io"

RUN mkdir -p /data-studio/

WORKDIR /data-studio/

COPY package*.json /data-studio/

RUN npm install

COPY . /data-studio/

ARG API_URL

ENV API_URL $API_URL

RUN npm run webpack:prod --prod

FROM nginx:1.19.0-alpine

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /data-studio/build/resources/main/static /usr/share/nginx/html

VOLUME ["/usr/share/nginx/html","/etc/nginx"]

EXPOSE 443 80

# uncomment below code to test with user
# RUN addgroup -S dx26user && adduser -S -G dx26user dx26user -h /home/dx26user
# RUN chown -R dx26user:dx26user /data-studio
# RUN chmod -R 755 /data-studio
# USER dx26user

ENTRYPOINT ["nginx", "-g", "daemon off;"]