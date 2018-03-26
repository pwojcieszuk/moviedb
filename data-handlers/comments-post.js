'use strict'

const Movie = require('../models/movie');
const Comment = require('../models/comment');

const createComment = (params) => {
    return new Promise((resolve, reject) => {
        Comment.create(params, (err, comment) => {
            err ? reject(err) : resolve(comment);
        });
    });
};

const handleRes = (req, res) => {
    if (! req.is('json'))
        return res.status(400).json({"error": "Content-type should be application/json."});

    const MovieId = req.body.MovieId || false;
    const Title = req.body.Title || false;
    const Text = req.body.Text || false;

    if (! MovieId && ! Title) return res.status(400).json({"error": "MovieId nor Title not provided."});

    if (MovieId && Title) return res.status(400).json({"error": "Please provide just one identifier: MovieId or Title."});
    
    if (Title && (typeof Title !== 'string' || ! Title instanceof String))
        return res.status(400).json({"error": "Title needs to be a string."});

    if (! Text) return res.status(400).json({"error": "Please provide Text."});

    const movieParams = MovieId ? {"_id": MovieId} : {"Title": Title};
    const findMovieQuery = Movie.findOne(movieParams);

    findMovieQuery.exec()
        .then(movie => {
            if (! movie) return false;
            
            return createComment({"MovieId": movie._id, "Text": Text});
        })
        .then(comment => {
            return comment;
        })
        .then(comment => comment ? res.json(comment) : res.status(400).json({"error": "Movie not found in our database"}))
        .catch(err => res.send(err));
};

module.exports = (req, res) => handleRes(req, res);
