FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=512"

RUN npm run build

RUN npm install -g serve

EXPOSE 4174

CMD ["serve", "-s", "dist", "-l", "4174"]