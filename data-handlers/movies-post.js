'use strict'

const Movie = require('../models/movie');
const fetchMovie = require('./movies-fetch-from-external');

const prepareFindOneQuery = title => Movie.findOne({"Title": title});

const handleRes = (req, res) => {
    if (! req.is('json'))
        return res.status(400).json({"error": "Content-type should be application/json."});

    let title = req.body.title || false;

    if (! title) return res.status(400).json({"error": "Title not provided."});
    
    if (typeof title !== 'string' || !title instanceof String)
        return res.status(400).json({"error": "Title needs to be a value that can be automatically stringified."});

    prepareFindOneQuery(title).exec()
        .then(movie => movie || fetchMovie.fetch(title))
        .then(movie => movie["Response"] === "False" ? res.status(204).json() : res.json(movie))
        .catch(err => {
            res.send(err);
        });
};

module.exports = (req, res) => handleRes(req, res);
