#!/usr/bin/env sh
set -eu

envsubst '${NGINX_PROXY} ${NGINX_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"