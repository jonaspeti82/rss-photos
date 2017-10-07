'use strict';  

const mongoose = require('mongoose');
const http = require('http');
const bodyParser  = require('body-parser');
const async = require('async');
const controller500px = require('./calls/500pxController');


let errors = [];

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
					errors.push(new Error('[HTTP GET /DELAY TEST] Invalid response: ' + response));
				callback(null);
			});			
			  
			// status code check
			if (statusCode !== 200) 
				errors.push(new Error('[HTTP GET /DELAY TEST] HTTP request did not success, statusCode: ' + statusCode));
						
			// delay API 5 second wait check
			let diff = Math.floor(new Date() / 1000) - unixtime_start;
			if (diff != 5)
				errors.push(new Error('[HTTP GET /DELAY TEST] Waited for ' + diff + ' seconds'));
		})
		.on('error', function (error) {
			errors.push(new Error('[HTTP GET /DELAY TEST] Failed to connect to the application via HTTP'));
			callback(null);
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
			
			console.log(JSON.stringify(photos500px[0], null, 4));
			callback(null);
		});
	}

], function () {
	if (errors.length > 0) 
		for (let i = 0; i < errors.length; i++)
			console.log(errors[i]);
	else 
		console.log('OK.');
});
