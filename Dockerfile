FROM node:9

LABEL version="1.0"
LABEL description="Simple movie search"
LABEL maintainer "Piotr Wojcieszuk <pwojcieszuk@gmail.com>"

RUN mkdir -p /usr/src/movie-db
WORKDIR /usr/src/movie-db
COPY ["package.json", "./"]

RUN yarn

RUN yarn global add nodemon mocha

ENV NODE_ENV production

RUN cd /usr/src/movie-db

COPY . .

EXPOSE 3000
