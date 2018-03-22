'use strict'

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => res.json({"comments": "todo"}));

router.get('/', (req, res) => res.json({"comments": "todo"}));

module.exports = router;
