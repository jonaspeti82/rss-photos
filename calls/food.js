'use strict';  

const express = require('express');
const Photos = require('../schema/photos');
const async = require('async');

var router = express.Router();


router.get('/', getLast10Photos);

async function getLast10Photos(req, res) {
	try {
		// TODO: Filter, order, etc.
		let photos = await Photos.find({}).sort({'createdAt': -1}).limit(10).exec();
		let result = '<table>';
		for (let i = 0; i < photos.length; i++) {
			result += '<tr>';
			result += '<td>' + photos[i].authorInfo.fullName + '</td>';
			result += '<td>' + photos[i].authorInfo.country + '</td>';
			result += '<td>' + photos[i].authorInfo.city + '</td>';
			result += '<td>' + photos[i].photoUrl + '</td>';
			result += '<td>' + photos[i].thumbnailUrl + '</td>';
			result += '<td>' + photos[i].createdAt + '</td>';
			result += '<td>' + photos[i].takenAt + '</td>';
			result += '<tr>';
		}
		result += '</table>';
		return res.send(result);
	}
	catch (error) {
		return res.status(500).send(error);
	}
};

module.exports = router;