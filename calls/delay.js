'use strict';  

const express = require('express');

var router = express.Router();

router.get('/', wait5Seconds);

function wait5Seconds(req, res) {
	setTimeout( function () {
		return res.send('Hello world!');
	}, 5000);
};

module.exports = router;