var twilio = require('twilio');
var dba = require('../modules/DbAccess');

var dbs = new dba();

var questions = [
	"Thank you for contacting PushToRent - a quick way to find your home. Please answer some questions to get started. Reply with Y to continue",
	"What is your name?",
	"What is your email address?",
	"What is your current mailing address?",
	"Thank you, your information has been saved. Use this link at any computer and print a list of matching houses - http://www.pushtorent.com/#/properties?user="
];


var db = {};

var config =
	module.exports = {
		incomingSms: function(request, response) {
			response.header('Content-Type', 'text/xml');
			var body = request.param('Body').trim();
			var to = request.param('To'); // My number
			var from = request.param('From'); // User's number 

			if (typeof db[from] === 'undefined') {
				db[from] = {
					current: 0,
					answers: []
				};
			}
			var respStr = [];

			if (db[from].current < questions.length) {
				if (db[from].current > 0) {
					respStr.push('[', db[from].current, '/', questions.length - 1, '] ');
				}

				if (db[from].current === questions.length - 1) {
					// last question
					console.log('Got all information for user', db[from].answers);
					var user = db[from].answers;
					dbs.setVal('users', from, {
						"fname": user[1],
						"email": user[2],
						"address": {
							"full": user[3]
						},
					});
				}
				respStr.push(questions[db[from].current]);

				if (db[from].current === questions.length - 1) {
					respStr.push(from);
				}

				db[from].answers.push(body);
				db[from].current += 1;
			} else {
				respStr.push('We will send you text when a house matching your criteria comes up');
			}

			console.log('[%s] (%d) %s', from, db[from].current, respStr.join(''));
			response.send('<Response>' + respStr.join('') + '</Response>');
		}
	}