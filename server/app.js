// IMPORTANT: Leave this log. It seems that heroku's foreman sets the 
// environment's PORT value asynchronously, so doing an IO op gives 
// enough time for foreman to set the value.
console.log('Starting...');

var express = require('express');
var app = express();
var promise = require('bluebird');
var bodyParser = require('body-parser');
var dba = require('../modules/DbAccess');

var dbs = new dba();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var usersDbName = 'users';

app.get('/test', function(req, res) {
	res.send('ok');
});

app.post('/server/users/:id', function(req, res) {
	console.log('Saving user ' + req.params.id + ': ' + req.body);
	dbs.setVal(usersDbName, req.params.id, req.body);
});

app.get('/server/users/:id', function(req, res) {
	console.log('Getting user ' + req.params.id);
	var user = dbs.getVal(usersDbName, req.params.id);
	res.send(user);
});

app.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port'));
});

