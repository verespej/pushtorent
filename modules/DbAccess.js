var fs = require('fs');
var path = require('path');

var dbsDirPath = './dbs';
var dbsFilePathSuffix = '.db.dat';

function DbAccess() {
	if (!fs.existsSync(dbsDirPath)) {
		console.log('Creating db dir ' + dbsDirPath);
		fs.mkdirSync(dbsDirPath);
	}

	this.dbs = {};
}

function getFilePath(dbName) {
	// TODO: Should validate dbName - e.g. shouldn't have '/', etc.
	return path.join(dbsDirPath, dbName + dbsFilePathSuffix);
}

DbAccess.prototype.set = function(dbName, db) {
	var dest = getFilePath(dbName);
	dbs[dbName] = db;

	console.log('Writing db to ' + dest);

	var text = JSON.stringify(dbs[dbName]);
	fs.writeFileSync(dest, text);
};

DbAccess.prototype.get = function(dbName) {
	if (typeof(dbs[dbName]) !== 'undefined') {
		return dbs[dbName];
	}

	var src = getFilePath(dbName);
	if (!fs.existsSync(src)) {
		throw new Error('DB not found: ' + dbName);
	}

	var db = JSON.parse(fs.readFileSync(src));
	dbs[dbName] = db;
	return db;
};

module.exports = DbAccess;

