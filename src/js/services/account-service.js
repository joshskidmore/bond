var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	bondCore = require('./lib'),
	userData = bondCore.userData;


function AccountService() {
	EventEmitter.call(this);

	// todo: this should probably be in a try/catch. Not sure how to surface errors
	// outside of the service though...
	this.accounts = this._readAccountsFromDisk();

	this.providers = bondCore.providers.list();
}
util.inherits(AccountService, EventEmitter);

/**
 * Fetches the accounts data directly from disk (intended for internal use only).
 */
AccountService.prototype._readAccountsFromDisk = function() {
	var rawData = userData.readFileSync('accounts.json');

	if (!rawData || !rawData.length) return [];

	return JSON.parse(rawData);
};

/**
 * Syncs the accounts array back to disk.
 */
AccountService.prototype.saveAccounts = function() {
	var strAccounts = angular.toJson(this.accounts);

	// todo: same as above... needs a try/catch, but don't know what to do once
	// we have the error.
	userData.writeFileSync('accounts.json', strAccounts);
};

bond.service('account', AccountService);
