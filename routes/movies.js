'use strict';

const express = require('express');
const getAllMovies = require('../data-handlers/movies-get-all');
const postMovie = require('../data-handlers/movies-post');

const router = express.Router();

router.post('/', (req, res) => postMovie(req, res));

router.get('/', (req, res) => getAllMovies(res));

module.exports = router;
