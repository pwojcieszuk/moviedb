'use strict';

const express = require('express');
const movies = require('./routes/movies');
const comments = require('./routes/comments');

const router = express.Router();

router.use('/movies', movies);
router.use('/comments', comments);

module.exports = router;
