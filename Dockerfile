FROM node:carbon-alpine

WORKDIR /Ether-Vote

RUN apk update && apk add git

COPY package*.json /Ether-Vote/

RUN npm install --no-optional

ADD . /Ether-Vote

EXPOSE 8080

CMD ["node", "index.js"]