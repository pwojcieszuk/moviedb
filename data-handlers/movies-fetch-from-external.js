'use strict'

const Movie = require('../models/movie');
const axios = require('axios');

const apiUrl = 'http://www.omdbapi.com/'
const apiKey='7eb6710a'

const prepareUpsertQuery = (title, movie) => Movie.findOneAndUpdate({"Title": title}, movie, {"upsert": true, "new": true});

const fetchMovie = title => {
    const resp = new Promise((resolve, reject) => {
        axios.get(apiUrl, {"params": { "apikey": apiKey, "t": title}})
        .then(resp => {
            const movie = resp.data;

            if (movie["Response"] === "False") return movie;

            delete movie.response;
            return prepareUpsertQuery(title, movie).exec();
        })
        .then(movie => resolve(movie))
        .catch(err => reject(err));
    });

    return resp;
};

module.exports = { "fetch": fetchMovie };
