'use strict'

const Movie = require('../models/movie');

module.exports = (res) => {
    Movie.find().exec((err, movies) => {
        err ? res.send(err) : res.json({"movies": movies});
    });
};
