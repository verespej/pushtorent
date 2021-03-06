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

var sms = require('./sms');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(path.join(__dirname, '../bin-site')));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/sms', sms.incomingSms);
app.post('/sms', sms.incomingSms);

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
	console.log('Listing properties for user ' + req.params.id);

	var user = null;
	try {
		user = dbs.getVal(usersDbName, req.params.id);
	} catch (err) {
		user = JSON.parse(fs.readFileSync(__dirname + '/../sampledata/test-user-01.json'));
	}

	var minCost = user.monthlyIncome / 4.0;
	var maxCost = user.monthlyIncome / 2.0;
	var costRange = maxCost - minCost;

	var selection = phdData.filter(function(item) {
		// Find locations within 50 miles of current home
		var userLoc = {
			latitude: user.address.lat,
			longitude: user.address.long
		};
		var propertyLoc = {
			latitude: item.lat,
			longitude: item.long
		};
		var dist = haversine(userLoc, propertyLoc);
		return dist < 25 && item.availableUnits > 0 && item.cost <= maxCost;
	}).map(function(item) {
		var dist = haversine({
			latitude: user.address.lat,
			longitude: user.address.long
		}, {
			latitude: item.lat,
			longitude: item.long
		});

		var normalizedCost = Math.max(item.cost - minCost, 0.0);
		var costFactor = normalizedCost / costRange;
		var score = Math.round(
			100.0 *
			(0.8 * (1.0 - costFactor)) +
			(0.2 * (1.0 - dist / 25.0))
		);
		return {
			id: item.id,
			name: item.name,
			desc: item.desc,
			lat: item.lat,
			long: item.long,
			score: score
		};
	});

	res.send(selection);
});

// Get details about property with given id
app.get('/server/properties/:id', function(req, res) {
	console.log('Getting user ' + req.params.id);

	var property = null;
	for (var i = 0; i < phdData.length; i++) {
		if (req.params.id === phdData[i].id) {
			property = phdData[i];
		}
	}

	if (property === null) {
		var property = JSON.parse(fs.readFileSync(__dirname + '/../sampledata/property-details.json'));
	}

	res.send({
		id: property.id,
		name: property.name,
		desc: property.desc,
		costToWork: '$3 - bus',
		healthCareServices: [
			'Virginia Mason Medical Center Psychiatry and Psychology',
			'Virginia Mason Hospital',
			'Core Physical Therapy',
			'Walgreens Pharmacy'
		],
		shopping: [
			'QFC',
			'Safeway',
			'Walgreens'
		],
		schools: [
			'Bailey Gatzert Elementary School',
			'Garfield High School'
		],
		crime: [
			{
				'name': 'breakins',
				'rate': '1.7/yr'
			}
		]
	});
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
	fs.mkdirSync(datasetsDirPath);
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
	runServer();

	// Don't need this at the moment, so don't download - it's aroudn 120MB
	/*var mfpDataPath = path.join(datasetsDirPath, 'multi-family-properties.json');
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
	}*/
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
			desc: 'A well-kept property located in the city. Good morning sun. Friendly neighbors and staff.',
			availableUnits: val.properties.REGULAR_VACANT,
			lat: val.properties.LAT,
			long: val.properties.LON
		};
	});

	app.listen(app.get('port'), function() {
		console.log('Listening on port ' + app.get('port'));
	});
}