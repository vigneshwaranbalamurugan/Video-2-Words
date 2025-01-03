FROM node:20.18.1

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /v2wbackend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm","start"]
