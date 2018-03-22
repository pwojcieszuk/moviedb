'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema(
    {
        "Source": String,
        "Value": String
    }
);

module.exports = RatingSchema;
