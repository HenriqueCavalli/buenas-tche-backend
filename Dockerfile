FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i pm2 -g
RUN npm i

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
