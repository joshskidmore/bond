/**
 *  Simple API over reading/writing user data files.  Please note the following:
 *  - File paths are relative to the current user's $HOME/.bond directory.
 *  - Reading non-existing files will simply return `null`, rather than throwing.
 *  - If the target directory for a write doesn't exist, it will be created.
 *  - All read/writes use 'utf8' encoding.
 */

var fs = require('fs'),
	path = require('path'),
	userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
	bondRoot = path.resolve(userHome, './.bond');

module.exports = {
	readFileSync: function(filePath) {
		var fullPath = path.resolve(bondRoot, filePath);
		try {
			return fs.readFileSync(fullPath, 'utf8');
		} catch (err) {
			if (/ENOENT/.test(err.message)) {
				return null;
			}
			throw err;
		}
	}
};