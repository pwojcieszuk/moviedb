'use strict'

const Comment = require('../models/comment');
const Movie = require('../models/movie');

module.exports = (req, res) => {
    const searchCriteria = {};
    const MovieId = req.query.MovieId || null;
    const Title = req.query.Title || null;

    if (MovieId) searchCriteria['MovieId'] = MovieId;

    Promise.resolve(searchCriteria)
    .then(searchCriteria => {

        if (! Title) return searchCriteria;

        return Movie.find({'Title': {'$regex': Title, '$options': 'i'}})
            .then(movies => {
                const movieIds = movies ? movies.map(movie => '' + movie._id) : [];
                searchCriteria['MovieId'] = { '$in': movieIds };
                return searchCriteria;
            });
    })
    .then(searchCriteria => {
        const query = Comment.find(searchCriteria);
        query.exec((err, comments) => {
            err ? res.send(err) : res.json({"comments": comments});
        });
    })
    .catch(err => { throw err; })
};
