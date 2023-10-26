#!/usr/bin/env sh
set -eu

envsubst '${GATEWAY_HOST} ${GATEWAY_API_PORT} ${GATEWAY_NETTY_SOCKET_IO_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"