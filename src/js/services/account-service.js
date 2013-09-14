var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	userData = require('./lib/user-data');

function AccountService() {
	EventEmitter.call(this);

	this._updateAccountsFromDisk();
}
util.inherits(AccountService, EventEmitter);

/**
 * Forces the accounts array to be refreshed from what's in the file system.
 * Intended for internal use only.
 */
AccountService.prototype._updateAccountsFromDisk = function() {
	var rawData = userData.readFileSync('accounts.json');
};

bond.service('account', AccountService);
