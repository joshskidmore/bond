/**
 *  Simple API over reading/writing user data files.  Please note the following:
 *  - File paths are relative to the current user's $HOME/.bond directory.
 *  - Reading non-existing files will simply return `null`, rather than throwing.
 *  - If the target directory for a write doesn't exist, it will be created.
 *  - All read/writes use 'utf8' encoding.
 */

var fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
	bondRoot = path.resolve(userHome, './.bond');

var userData = module.exports = {}

userData.readFileSync = function(filePath) {
	var fullPath = path.resolve(bondRoot, filePath);
	try {
		return fs.readFileSync(fullPath, 'utf8');
	} catch (err) {
		if (err.code === 'ENOENT') {
			return null;
		}
		throw err;
	}
};

userData.writeFileSync = function(filePath, data) {
	var dirPath = filePath.split('/').slice(0, -1).join('/'),
		fullDirPath = path.resolve(bondRoot, dirPath),
		fullFilePath = path.resolve(bondRoot, filePath);

	if (!fs.existsSync(fullDirPath)) {
		mkdirp.sync(fullDirPath);
	}

	fs.writeFileSync(fullFilePath, 'utf8', data);
};
