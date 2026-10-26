FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
RUN apk upgrade --no-cache
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
