FROM node:carbon

WORKDIR /usr/src/ethervote

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
