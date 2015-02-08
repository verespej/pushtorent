// IMPORTANT: Leave this log. It seems that heroku's foreman sets the 
// environment's PORT value asynchronously, so doing an IO op gives 
// enough time for foreman to set the value.
console.log('Starting...');

var express = require('express');
var app = express();
var promise = require('bluebird');
var bodyParser = require('body-parser');
var dba = require('../modules/DbAccess');
var path = require('path');

var dbs = new dba();


app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, '../bin-site')));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var usersDbName = 'users';

try {
	dbs.getDb(usersDbName);
} catch(err) {
	dbs.setDb(usersDbName, {});
}


app.get('/test', function(req, res) {
	res.send('ok');
});


// Get info about user with given id
app.get('/server/users/:id', function(req, res) {
	console.log('Getting user ' + req.params.id);
	var user = dbs.getVal(usersDbName, req.params.id);
	res.send(user);
});

// Create user with given id
app.post('/server/users/:id', function(req, res) {
	console.log('Creating user ' + req.params.id + ': ' + req.body);
	dbs.setVal(usersDbName, req.params.id, req.body);
});

// /server/properties?user={id}
// Get properties list for a specific user
app.get('/server/properties', function(req, res) {
	var data = [];
	for (var i = 0; i < 10; i++) {
		data.push({
			id: i,
			name: 'NAME',
			desc: 'description',
			img: 'http://placehold.it/242x200',
			score: '100'
		});
	}
	res.send(data);
});

// Get details about property with given id
app.get('/server/properties/:id', function(req, res) {
	res.status(501).send('Not implemented');
});

// Create details about property with given id
app.set('/server/properties/:id', function(req, res) {
	res.status(501).send('Not implemented');
});

// Get all applications for a specific user
// /server/applications?user={id}
app.get('/server/applications', function(req, res) {
	var data = [];
	for (var i = 0; i < 10; i++) {
		data.push({
			id: i,
			property: {
				id: i,
				name: 'NAME',
				desc: 'description',
				img: 'http://placehold.it/242x200',
				score: '100'
			},
			status: 'underReview'
		});
	}
	res.send(data);
});

// Get an application with given id
app.get('/server/applications/:id', function(req, res) {
	res.status(501).send('Not implemented');
});

// Create an application with given id
app.post('/server/applications/:id', function(req, res) {
	res.status(501).send('Not implemented');
});


app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port'));
});

