FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf

COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
