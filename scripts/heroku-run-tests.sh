#!/bin/bash

heroku local:run -e .env.test yarn test
