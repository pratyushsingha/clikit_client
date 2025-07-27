
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=1024"

RUN npm run build


FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4174

CMD ["serve", "-s", "dist", "-l", "4174"]
