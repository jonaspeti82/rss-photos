'use strict';  

const express = require('express');
const async = require('async');
const API500px = require('500px');
const Photos = require('../schema/photos');

var router = express.Router();


exports.getLatest100Photos = function (consumer_key, finally_callback) {
	let errors = [];
	let photoList = [];
	let api500px = null;
	
	async.waterfall([
	
		function (callback) {
			try {
				api500px = new API500px(consumer_key);
				api500px.photos.searchByTag('food', {'sort': 'created_at', 'rpp': '100', 'tags': 1 }, function (errors500px, results) {
					if (results) {
						for (let i = 0; i < results.photos.length; i++) {
							let photo = new Photos({});
							photo.createdAt = results.photos[i].created_at;
							photo.takenAt = results.photos[i].taken_at;
							photo.photoUrl = results.photos[i].image_url;
							photo.thumbnailUrl = 'https://drscdn.500px.org/'+results.photos[i].url;
							photo.authorInfo.fullName = results.photos[i].user.fullname;
							photo.authorInfo.city = results.photos[i].user.city;
							photo.authorInfo.country = results.photos[i].user.country;
							if (results.photos[i].tags)
								photo.tags = results.photos[i].tags;
							photoList.push(photo);
						}
					}
					if (errors500px)
						errors = errors500px;
					return callback(null);
				});
			}
			catch (error) {
				errors.push(error);
				return callback(null);
			}
		},
		
	
	], function () {
		return finally_callback(errors, photoList);
	});	
}

exports.savePhotosToDB = async function (photos) {
	let errors = [];
	try {
		for (let i = 0; i < photos.length; i++)
			await photos[i].save();
	}
	catch (error) {
		console.log('savePhotosToDB error');
		errors.push(error);
	}
	return errors;
};
