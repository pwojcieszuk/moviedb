'use strict'

const express = require('express');
const getAllMovies = require('../data-handlers/movies-get-all');

const router = express.Router();

router.post('/', (req, res) => res.json({"movies": "todo"}));

router.get('/', (req, res) => {
    getAllMovies(res);
});

module.exports = router;
