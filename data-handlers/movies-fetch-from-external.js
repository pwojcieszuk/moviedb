'use strict';

const Movie = require('../models/movie');
const axios = require('axios');

const apiUrl = process.env.EXTERNAL_MOVIE_API_URI;
const apiKey = process.env.EXTERNAL_MOVIE_API_KEY;

const prepareUpsertQuery = (Title, movie) => Movie.findOneAndUpdate({'Title': Title}, movie, {'upsert': true, 'new': true});

const fetchMovie = Title => {
    const resp = new Promise((resolve, reject) => {
        axios.get(apiUrl, {'params': { 'apikey': apiKey, 't': Title}})
            .then(resp => {
                const movie = resp.data;

                if (movie['Response'] === 'False') return movie;

                delete movie.response;
                return prepareUpsertQuery(Title, movie).exec();
            })
            .then(movie => resolve(movie))
            .catch(err => reject(err));
    });

    return resp;
};

module.exports = { 'fetch': fetchMovie };
