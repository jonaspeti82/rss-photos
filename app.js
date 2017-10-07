'use strict';  

const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const bodyParser  = require('body-parser');
const schedule = require('node-schedule');

var app = express();


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
var j = schedule.scheduleJob('0 0 * * *', function(){
  console.log('doing the hourly job');
});

// routes
require('./routes')(app);


module.exports = app;
