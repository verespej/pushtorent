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
var fs = require('fs');

var dbs = new dba();


app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, '../bin-site')));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var usersDbName = 'users';

try {
	dbs.getDb(usersDbName);
} catch (err) {
	dbs.setDb(usersDbName, {});
}

if (!fs.existsSync('server/datasets')) {
	fs.mkdir('server/datasets');
}
if (!fs.existsSync('server/datasets/public-housing-developments.json')) {
	// TODO: DL & save
	// http://zillowhack.hud.opendata.arcgis.com/datasets/1cef73e2612f4cf7a46f8e40108d72bc_0.geojson
}
if (!fs.existsSync('server/datasets/multi-family-properties.json')) {
	// TODO: DL & save
	//'http://zillowhack.hud.opendata.arcgis.com/datasets/c55eb46fbc3b472cabd0c2a41f805261_0.geojson'
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
	var file = 'properties.json'
	res.send(require('fs').readFileSync(__dirname + '/../sampledata/' + file));
});

// Get details about property with given id
app.get('/server/properties/:id', function(req, res) {
	var file = 'property-details.json'
	res.send(require('fs').readFileSync(__dirname + '/../sampledata/' + file));
});

// Create details about property with given id
app.post('/server/properties/:id', function(req, res) {
	res.status(501).send('Not implemented');
});

// Get all applications for a specific user
// /server/applications?user={id}
app.get('/server/applications', function(req, res) {
	var file = 'applications.json'
	res.send(require('fs').readFileSync(__dirname + '/../sampledata/' + file));
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