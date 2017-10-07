'use strict';  

const express = require('express');
const async = require('async');
const API500px = require('500px');
const PhotoList = require('../schema/photolist');

var router = express.Router();


exports.getLatest100Photos = function (consumer_key, finally_callback) {
	let errors = [];
	let photos = [];
	let api500px = null;
	
	async.waterfall([
	
		function (callback) {
			try {
				api500px = new API500px(consumer_key);
				api500px.photos.searchByTag('food', {'sort': 'created_at', 'rpp': '100'}, function (errors500px, results) {
					if (results)
						photos = results;
					if (errors500px)
						errors = errors500px;
					else {
						// TODO: Parse photos for response!
					}
					callback(null);
				});
			}
			catch (error) {
				errors.push(error);
				callback(null);
			}
		},
		
	
	], function () {
		return finally_callback(errors, photos);
	});	
}

exports.savePhotosToDB = async function (photos) {
	let errors = [];
	try {
		for (let photo in photos) {
			
			
			//await photo.save();
		}
	}
	catch (error) {
		errors.push(error);
	}
	return errors;
};
