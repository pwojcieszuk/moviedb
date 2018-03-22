'use strict'

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => res.json({"movies": "todo"}));

router.get('/', (req, res) => res.json({"movies": "todo"}));

module.exports = router;
