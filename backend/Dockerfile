FROM node:18-alpine3.17

WORKDIR /srv/app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm install -g nodemon

CMD ["npm", "run", "dev"]