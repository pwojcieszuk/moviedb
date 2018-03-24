#!/bin/bash

docker-compose -f docker-compose.test.yml -p testing up -d --build
docker exec -it moviedb-test mocha --exit
docker-compose -f docker-compose.test.yml -p testing stop
