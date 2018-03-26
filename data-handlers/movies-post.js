'use strict'

const Movie = require('../models/movie');
const fetchMovie = require('./movies-fetch-from-external');

const prepareFindOneQuery = Title => Movie.findOne({"Title": Title});

const handleRes = (req, res) => {
    if (! req.is('json'))
        return res.status(400).json({"error": "Content-type should be application/json."});

    const Title = req.body.Title || false;

    if (! Title) return res.status(400).json({"error": "Title not provided."});
    
    if (typeof Title !== 'string' || !Title instanceof String)
        return res.status(400).json({"error": "Title needs to be a value that can be automatically stringified."});

    prepareFindOneQuery(Title).exec()
        .then(movie => movie || fetchMovie.fetch(Title))
        .then(movie => movie["Response"] === "False" ? res.status(204).json() : res.json(movie))
        .catch(err => res.send(err));
};

module.exports = (req, res) => handleRes(req, res);
