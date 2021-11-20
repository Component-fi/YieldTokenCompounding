FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt update -y

RUN apt install libsecret-1-0 -y

RUN npm ci

COPY . .

EXPOSE 8545

CMD [ "npm", "run", "start"]
