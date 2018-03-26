'use strict';

const express = require('express');
const getAllComments = require('../data-handlers/comments-get-all');
const postComment = require('../data-handlers/comments-post');

const router = express.Router();

router.post('/', (req, res) => postComment(req, res));

router.get('/', (req, res) => getAllComments(req, res));

module.exports = router;
