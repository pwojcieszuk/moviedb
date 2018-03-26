'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        'MovieId': Schema.Types.ObjectId,
        'Text': String,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
