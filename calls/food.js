'use strict';  

const express = require('express');
const Photos = require('../schema/photos');
const async = require('async');

var router = express.Router();


router.get('/', getLast10Photos);

async function getLast10Photos(req, res) {
	try {
		// TODO: Filter, order, etc.
		let photos = await Photos.find({}).exec();
		return res.json(users);
	}
	catch (error) {
		return res.status(500).send(error);
	}
};

module.exports = router;