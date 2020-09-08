FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./

COPY public /app/public

COPY src /app/src

RUN npm install && npm install -g serve && npm run build

CMD ["serve", "-l", "3000", "-s", "build"]