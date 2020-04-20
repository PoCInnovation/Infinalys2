FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm install

CMD [ "node", "index.js" ]