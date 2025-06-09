# 1. Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# 2. Production Stage
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 inside container (nginx default)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
