#!/bin/bash

docker-compose -f docker-compose.test.yml -p testing up -d --build
docker-compose -f docker-compose.test.yml -p testing logs
docker-compose -f docker-compose.test.yml -p testing stop
