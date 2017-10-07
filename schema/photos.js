'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotosSchema = new Schema({
	thumbnailUrl: String,
	photoUrl: String,
	takenAt: Date,
	createdAt: Date,
	tags: [
		{ type: String }
	],
	authorInfo: {
		fullName: String,
		country: String,
		city: String
	}
}, {
	timestamps: true
});

PhotosSchema.index({thumbnailUrl: 1});

module.exports = mongoose.model('Photos', PhotosSchema);
