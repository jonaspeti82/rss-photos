'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoListSchema = new Schema({
	thumbnailUrl: String,
	ptotoUrl: String,
	takenAt: Date,
	tags: [
		{ type: String }
	],
	authorInfo: String
}, {
	timestamps: true
});

PhotoListSchema.index({thumbnailUrl: 1});

module.exports = mongoose.model('PhotoList', PhotoListSchema);
