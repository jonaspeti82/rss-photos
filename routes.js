'use strict';  

module.exports = function(app) {

	app.use('/photos/food', require('./calls/food'));
	app.use('/api/photos', require('./calls/photos'));
	app.use('/delay', require('./calls/delay'));
	
	// blocking some urls
	app.route('/:url(calls|schema|tests)/*').get(function (req, res) {
		res.sendFile(__dirname + '/404.html');
	});
	
	// index.html for the others
	app.route('/*').get(function(req, res) {
		res.sendFile(__dirname + '/index.html');
    });
  
}