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
var http = require('http');
var haversine = require('haversine');

var dbs = new dba();


app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, '../bin-site')));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


var usersDbName = 'users';
var propertiesDbName = 'properties';
var applicationsDbName = 'applications';

try {
	dbs.getDb(usersDbName);
} catch (err) {
	dbs.setDb(usersDbName, {});
}


var phdData = null;


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

	// TODO: look up lat-long when user is submitted (or have it done on client side)

	dbs.setVal(usersDbName, req.params.id, req.body);
});

// /server/properties?user={id}
// Get properties list for a specific user
app.get('/server/properties', function(req, res) {
	var user = null;
	try {
		user = dbs.getVal(usersDbName, req.params.id);
	} catch (err) {
		user = JSON.parse(fs.readFileSync(__dirname + '/../sampledata/test-user-01.json'));
	}

	var selection = phdData.filter(function(item) {
		// Find locations within 50 miles of current home
		var dist = haversine({ user.lat, user.long }, { item.lat, item.long });
		return dist < 50 && item.availableUnits > 0;
	}).map(function(item) {
		var dist = haversine({ user.lat, user.long }, { item.lat, item.long });
		var score = 
			(0.8 * (1.0 - Math.max(cost/500.0, 1.0))) + 
			(0.2 * (1.0 - dist/50.0));

		return {
			id: 'phd-' + val.properties.OBJECTID,
			name: val.properties.PROJECT_NAME,
			desc: 'A well-kept property located in the city. Good morning sun. Friendly neighbors and staff.'
			lat: item.lat,
			long: item.long,
			score: score
		};
	});

	res.send(selection);
});

// Get details about property with given id
app.get('/server/properties/:id', function(req, res) {
	var file = 'property-details.json'
	res.send(fs.readFileSync(__dirname + '/../sampledata/' + file));
	//console.log('Getting user ' + req.params.id);
	//var user = dbs.getVal(usersDbName, req.params.id);
	//res.send(user);
});

// Create details about property with given id
app.post('/server/properties/:id', function(req, res) {
	console.log('Creating property ' + req.params.id + ': ' + req.body);
	dbs.setVal(propertiesDbName, req.params.id, req.body);
});

// Get all applications for a specific user
// /server/applications?user={id}
app.get('/server/applications', function(req, res) {
	var file = 'applications.json'
	res.send(fs.readFileSync(__dirname + '/../sampledata/' + file));
	// TODO: Select properties for user from phdData
	//var userApps = dbs.getDb(applicationsDbName).filter(function(item) {
	//	return item.id === req.query.user;
	//});
	//res.send(userApps);
});

// Get an application with given id
app.get('/server/applications/:id', function(req, res) {
	console.log('Getting application ' + req.params.id);
	var application = dbs.getVal(applicationsDbName, req.params.id);
	res.send(application);
});

// Create an application with given id
app.post('/server/applications/:id', function(req, res) {
	console.log('Creating application ' + req.params.id + ': ' + req.body);
	dbs.setVal(applicationsDbName, req.params.id, req.body);
});



var datasetsDirPath = 'server/datasets';
var reqOpts = {
	hostname: 'zillowhack.hud.opendata.arcgis.com',
	port: 80,
	method: 'GET'
};

if (!fs.existsSync(datasetsDirPath)) {
	fs.mkdir(datasetsDirPath);
}

var phdDataPath = path.join(datasetsDirPath, 'public-housing-developments.json');
if (!fs.existsSync(phdDataPath)) {
	reqOpts.path = '/datasets/1cef73e2612f4cf7a46f8e40108d72bc_0.geojson';
	console.log('Getting file ' + reqOpts.path + '...');
	var req = http.get(reqOpts, function(res) {
		res.on('data', function(chunk) {
			fs.appendFileSync(phdDataPath, chunk);
		});
		res.on('end', function() {
			console.log('Done getting ' + reqOpts.path);
			getMfp();
		});
	});
	req.on('error', function(err) {
		console.log('Failed to download ' + reqOpts.path);
		process.exit(1);
	});
	req.end();
} else {
	getMfp();
}

function getMfp() {
	var mfpDataPath = path.join(datasetsDirPath, 'multi-family-properties.json');
	if (!fs.existsSync(mfpDataPath)) {
		reqOpts.path = '/datasets/c55eb46fbc3b472cabd0c2a41f805261_0.geojson';
		console.log('Getting file ' + reqOpts.path + '...');
		var req = http.get(reqOpts, function(res) {
			res.on('data', function(chunk) {
				fs.appendFileSync(mfpDataPath, chunk);
			});
			res.on('end', function() {
				console.log('Done getting ' + reqOpts.path);
				runServer();
			});
		});
		req.on('error', function(err) {
			console.log('Failed to download ' + reqOpts.path);
			process.exit(1);
		});
		req.end();
	} else {
		runServer();
	}
}


function runServer() {
	// TODO: Store in DB using propertiesDbName
	var phdRawData = JSON.parse(fs.readFileSync(phdDataPath));
	phdData = phdRawData.features.map(function(val) {
		return {
			id: 'phd-' + val.properties.OBJECTID,
			name: val.properties.PROJECT_NAME,
			address: val.properties.STD_ADDR + ', ' + 
				val.STD_CITY + ', ' + 
				val.STD_ST + ' ' + 
				val.STD_ZIP5,
			cost: val.properties.RENT_PER_MONTH,
			availableUnits: val.properties.REGULAR_VACANT,
			lat: val.properties.LAT,
			long: val.properties.LONG
		};
	});

	app.listen(app.get('port'), function() {
		console.log('Listening on port ' + app.get('port'));
	});
}