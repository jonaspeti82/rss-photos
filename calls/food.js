'use strict';  

const express = require('express');
const Photos = require('../schema/photos');
const async = require('async');

var router = express.Router();


router.get('/', getLast10Photos);
router.get('/:page', getLast10Photos);

async function getLast10Photos(req, res) {
	try {
		let totalCount = await Photos.count({}).exec();
		let totalPageCount = Math.ceil(totalCount/10);		
		let page = 0;
		if (req.params.page && (parseInt(req.params.page) < totalPageCount))
			page = parseInt(req.params.page);
		let photos = await Photos.find({}).sort({'createdAt': -1}).skip(page*10).limit(10).exec();
		
		// header
		let result = '<h3>Welcome on page ' + page + '!</h3><br/>';
		
		for (let i = 0; i < totalPageCount; i++) {
			if (i == page)
				result += '<span style="background: red">[ ' + i + ' ]</span>&nbsp;';
			else
				result += '<a href="/photos/food/'+i+'">[ ' + i + ' ]</a>&nbsp;';
		}
		result += "<br><br>";
		
		// table
		result += '<table>';
		for (let i = 0; i < photos.length; i++) {
			let item = [
				photos[i].authorInfo.fullName,
				photos[i].authorInfo.country,
				photos[i].authorInfo.city,
				photos[i].photoUrl,
				photos[i].thumbnailUrl,
				photos[i].createdAt,
				photos[i].takenAt
			];
			result += '<tr><td>' + item.join('</td><td>') + '</td></tr>';
		}
		result += '</table>';
		
		return res.send(result);
	}
	catch (error) {
		return res.status(500).send(error);
	}
};

module.exports = router;