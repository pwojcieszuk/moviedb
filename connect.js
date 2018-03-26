'use strict';

const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('MongoDB connected on ' + mongoUrl);
});

module.exports = db;
