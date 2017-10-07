'use strict';  

const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const bodyParser  = require('body-parser');
const schedule = require('node-schedule');
const controller500px = require('./calls/500pxController');

var app = express();

function downloadAndSavePhotos() {
	controller500px.getLatest100Photos('p0Czx7dTzziSPbsXkd7TVenHNjTaJXEqpCck2LA3', function (errors, photos) {
		if (errors && (errors.length > 0)) {
			console.log('Error occured while tried to update photos:');
			console.log(errors);
		}
		else if (!photos || (photos.length < 100))
			console.log('Not found 100 photos this time.');
		else {
			(async () => {
				console.log('Saving photos...');
				await controller500px.savePhotosToDB(photos);
				console.log('Photos saved!');
			})();
		}
	});
}

// MongoDB connection initialization
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', function () {
	console.log('MongoDB connected');
});
mongoose.connection.on('error', function (error) {
	console.error('MongoDB connection error: ' + error);
});
mongoose.connect('mongodb://localhost/rss-photos', { useMongoClient: true });


// HTTP server initialization
var server = http.createServer(app);
server.listen(80, '0.0.0.0', function () {
	console.log('Express server listening on %d, in %s mode', 9000, app.get('env'));
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// sheduled tasks
downloadAndSavePhotos();
var j = schedule.scheduleJob('0 0 * * *', function () { downloadAndSavePhotos(); });

// routes
require('./routes')(app);


module.exports = app;
