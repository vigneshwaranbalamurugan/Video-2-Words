FROM node:20.18.1

WORKDIR /video2words

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run","dev"]

