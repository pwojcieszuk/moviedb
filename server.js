'use strict'

const express = require('express');
const db = require('./connect');
const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

app.use(router);

if (!module.parent) {
    app.listen(port, () => console.log('Server started on port ' + port));
}

module.exports = app;
