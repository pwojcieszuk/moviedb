'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
require('./connect');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(router);

if (!module.parent) {
    app.listen(port, () => console.log('Server started on port ' + port));
}

module.exports = app;
