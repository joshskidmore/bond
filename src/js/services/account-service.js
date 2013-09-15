var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	userData = require('./lib/user-data');

function AccountService() {
	EventEmitter.call(this);

	// todo: this should probably be in a try/catch. Not sure how to surface errors
	// outside of the service though...
	this.accounts = this._readAccountsFromDisk();
}
util.inherits(AccountService, EventEmitter);

/**
 * Fetches the accounts data directly from disk (intended for internal use only).
 */
AccountService.prototype._readAccountsFromDisk = function() {
	var rawData = userData.readFileSync('accounts.json');

	if (!rawData) return [];

	return JSON.parse(rawData);
};

/**
 * Fetches the accounts data directly from disk (intended for internal use only).
 */
AccountService.prototype.saveAccounts = function() {
	var strAccounts = JSON.stringify(this.accounts);

	// todo: same as above... needs a try/catch, but don't know what to do once
	// we have the error.
	userData.writeFileSync(strAccounts);
};

bond.service('account', AccountService);
