FROM node:13.12.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY node_modules ./
COPY package.json ./
COPY package-lock.json ./
COPY public ./
COPY src ./
RUN npm install
COPY . ./
CMD ["npm", "start"]