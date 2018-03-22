'use strict'

const express = require('express');
let mongoose = require('mongoose');
let Movie = require('../models/movie');

const router = express.Router();

router.post('/', (req, res) => res.json({"movies": "todo"}));

router.get('/', (req, res) => {
    let query = Movie.find();
    query.exec((err, movies) => {
        err ? res.send(err) : res.json({"movies": movies});
    });
    
});

module.exports = router;
