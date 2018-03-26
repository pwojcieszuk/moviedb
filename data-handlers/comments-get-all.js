'use strict'

const Comment = require('../models/comment');

module.exports = (req, res) => {
    const query = Comment.find();
    query.exec((err, comments) => {
        err ? res.send(err) : res.json({"comments": comments});
    });
};
