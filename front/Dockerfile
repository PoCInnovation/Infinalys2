FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./

RUN npm install

COPY public /app/public

COPY src /app/src

CMD ["npm", "start"]