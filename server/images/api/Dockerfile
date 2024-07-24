FROM node:latest

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --quiet

RUN npm install -g nodemon

COPY ./ ./

EXPOSE 3000

CMD ["npm", "start"]