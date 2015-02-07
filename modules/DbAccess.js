var fs = require('fs');
var path = require('path');

var dbsDirPath = './dbs';
var dbsFilePathSuffix = '.db.json';

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

DbAccess.prototype.setDb = function(dbName, db) {
	var dest = getFilePath(dbName);
	this.dbs[dbName] = db;

	console.log('Writing db to ' + dest);

	var text = JSON.stringify(this.dbs[dbName]);
	fs.writeFileSync(dest, text);
};

DbAccess.prototype.getDb = function(dbName) {
	if (typeof(this.dbs[dbName]) !== 'undefined') {
		return this.dbs[dbName];
	}

	var src = getFilePath(dbName);
	if (!fs.existsSync(src)) {
		throw new Error('DB not found: ' + dbName);
	}

	var db = JSON.parse(fs.readFileSync(src));
	this.dbs[dbName] = db;
	return db;
};

DbAccess.prototype.setVal = function(dbName, key, val) {
	if (typeof(this.dbs[dbName]) === 'undefined') {
		this.dbs[Name] = {};
	}
	this.dbs[dbName][key] = val;
	this.setDb(dbName, this.dbs[dbName]);
}

DbAccess.prototype.getVal = function(dbName, key) {
	var db = this.getDb(dbName);
	if (typeof(db[key]) === 'undefined') {
		throw new Error('DB ' + dbName + ' doesn\'t contain an entry for ' + key);
	}
	return db[key];
};

module.exports = DbAccess;
