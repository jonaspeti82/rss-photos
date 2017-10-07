'use strict';  

const express = require('express');
const Photos = require('../schema/photos');
const async = require('async');

var router = express.Router();


router.get('/', getAllPhotosAsJSON);
router.delete('/', deleteAllPhotos);

async function getAllPhotosAsJSON(req, res) {
	try {
		let photos = await Photos.find({}).exec();
		return res.json(photos);
	}
	catch (error) {
		return res.status(500).send(error);
	}
};

async function deleteAllPhotos(req, res) {
	try {
		let photos = await Photos.remove({}).exec();
		return res.status(200).json({ message: "Images deleted"});
	}
	catch (error) {
		return res.status(500).send(error);
	}
};

module.exports = router;