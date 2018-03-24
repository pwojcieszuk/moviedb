'use strict'

const Movie = require('../models/movie');

module.exports = (res) => {
    let query = Movie.find();
    query.exec((err, movies) => {
        err ? res.send(err) : res.json({"movies": movies});
    });
};
