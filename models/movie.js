'use strict';

const mongoose = require('mongoose');
const RatingSchema = require('./rating');
const Schema = mongoose.Schema;

const MovieSchema = new Schema(
    {
        'Title': String,
        'Year': String,
        'Rated': String,
        'Released': String,
        'Runtime': String,
        'Genre': String,
        'Director': String,
        'Writer': String,
        'Actors': String,
        'Plot': String,
        'Language': String,
        'Country': String,
        'Awards': String,
        'Poster': String,
        'Ratings': [RatingSchema],
        'Metascore': String,
        'imdbRating': String,
        'imdbVotes': String,
        'imdbID': String,
        'Type': String,
        'DVD': String,
        'BoxOffice': String,
        'Production': String,
        'Website': String
    }
);

module.exports = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
