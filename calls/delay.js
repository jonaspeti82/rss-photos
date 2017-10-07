'use strict';  

const express = require('express');

var router = express.Router();

router.get('/', wait5Seconds);

async function wait5Seconds(req, res) {
	// wait for 5 seconds...
	return res.send('Hello world!');
};

module.exports = router;