FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

EXPOSE 7000

CMD sh -c "npx prisma migrate deploy && node dist/main.js"
