'use strict';  

const mongoose = require('mongoose');
const http = require('http');
const bodyParser  = require('body-parser');
const async = require('async');
const controller500px = require('./calls/500pxController');
const Photos = require('./schema/photos');


let errors = [];

mongoose.Promise = global.Promise;
mongoose.connection.on('connected', function () {
	console.log('MongoDB connected');
});
mongoose.connection.on('error', function (error) {
	console.error('MongoDB connection error: ' + error);
});
mongoose.connect('mongodb://localhost/rss-photos', { useMongoClient: true });


async.waterfall([

	// our app is available via HTTP, and /GET delay works well
	function (callback) {
		let unixtime_start = Math.floor(new Date() / 1000);
		
		http.get({
			host: 'localhost',
			port: 80,
			path: '/delay',
			method: 'GET',
		}, function (res) {
			const { statusCode } = res;
			
			// response string check
			let response = '';
			res.on('data', (chunk) => { response += chunk; });
			res.on('end', () => {
				if (response != 'Hello world!')
					errors.push(new Error('[HTTP GET /delay TEST] Invalid response: ' + response));
				return callback(null);
			});			
			  
			// status code check
			if (statusCode !== 200) 
				errors.push(new Error('[HTTP GET /delay TEST] HTTP request did not success, statusCode: ' + statusCode));
						
			// delay API 5 second wait check
			let diff = Math.floor(new Date() / 1000) - unixtime_start;
			if (diff != 5)
				errors.push(new Error('[HTTP GET /delay TEST] Waited for ' + diff + ' seconds'));
		})
		.on('error', function (error) {
			errors.push(new Error('[HTTP GET /delay TEST] Failed to connect to the application via HTTP'));
			return callback(null);
		});
	},
	
	
	
	// 500px API testing
	function (callback) {
		controller500px.getLatest100Photos('p0Czx7dTzziSPbsXkd7TVenHNjTaJXEqpCck2LA3', function (errors500px, photos500px) {
			if (errors500px.length > 0)
				for (let i = 0; i < errors500px.length; i++) 
					errors.push(errors500px[i]);
				
			if (!photos500px)
				errors.push('[500px API] Not found any photos');
			else if (photos500px.length < 100)
				errors.push('[500px API] Not found 100 photos, just ' + photos500px.length);

			
			if (0 == errors.length) {
				(async () => {
					await controller500px.savePhotosToDB(photos500px);
					return callback(null);
				})();				
			}
			else
				return callback(null);
			
		});
	},
	
	// API testing: GET /api/photos
	function (callback) {
		http.get({
			host: 'localhost',
			port: 80,
			path: '/api/photos',
			method: 'GET',
		}, function (res) {
			const { statusCode } = res;
			
			// response string check
			let response = '';
			res.on('data', (chunk) => { response += chunk; });
			res.on('end', () => {
				
				try {
					let json_response = JSON.parse(response);
					
					if (json_response.length < 1)
						errors.push(new Error('[HTTP GET /api/photos TEST] 0 results in JSON array'));
					
					Photos.count({}, function (err, cnt) {
						if (err)
							errors.push(new Error('[HTTP GET /api/photos TEST] Failed to query the database for count of stored photos'));
						else if (cnt != json_response.length)
							errors.push(new Error('[HTTP GET /api/photos TEST] Different count in DB and the API response (' + cnt + ' != ' +  json_response.length  + ')'));
						return callback(null);
					});
				}
				catch (err) {
					errors.push(err);
					errors.push(new Error('[HTTP GET /api/photos TEST] Response is not valid JSON'));
					return callback(null);
				}
			});			
			  
			// status code check
			if (statusCode !== 200) 
				errors.push(new Error('[HTTP GET /api/photos TEST] HTTP request did not success, statusCode: ' + statusCode));
		})
		.on('error', function (error) {
			errors.push(new Error('[HTTP GET /api/photos TEST] Failed to connect to the application via HTTP'));
			return callback(null);
		});
	},
	

	// API testing: DELETE /api/photos
	function (callback) {
		http.get({
			host: 'localhost',
			port: 80,
			path: '/api/photos',
			method: 'DELETE',
		}, function (res) {
			const { statusCode } = res;
			
			// response string check
			let response = '';
			res.on('data', (chunk) => { response += chunk; });
			res.on('end', () => {
				try {
					let json_response = JSON.parse(response);
					if (!json_response.message || ("Images deleted" !== json_response.message))
						errors.push(new Error('[HTTP DELETE /api/photos TEST] Invalid response (' + response + ')'));
					
					Photos.count({}, function (err, cnt) {
						if (err)
							errors.push(new Error('[HTTP DELETE /api/photos TEST] Failed to query the database for count of stored photos'));
						else if (cnt != 0)
							errors.push(new Error('[HTTP DELETE /api/photos TEST] Different count in DB and the API response (' + cnt + ' != 0)'));
						return callback(null);
					});
					
				}
				catch (err) {
					errors.push(err);
					errors.push(new Error('[HTTP DELETE /api/photos TEST] Response is not valid JSON'));
					return callback(null);
				}
			});			
			  
			// status code check
			if (statusCode !== 200) 
				errors.push(new Error('[HTTP DELETE /api/photos TEST] HTTP request did not success, statusCode: ' + statusCode));
		})
		.on('error', function (error) {
			errors.push(new Error('[HTTP DELETE /api/photos TEST] Failed to connect to the application via HTTP'));
			return callback(null);
		});
	},
	
	

], function () {
	if (errors.length > 0) {
		for (let i = 0; i < errors.length; i++)
			console.log(errors[i]);
		process.exit(1);
	}
	else { 
		console.log('OK.');
		process.exit(0);
	}
	
});
