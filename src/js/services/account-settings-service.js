var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	bondCore = require('./lib'),
	userData = bondCore.userData,
	CURRENT_FILE_VERSION = 1;


function AccountSettingsService() {
	EventEmitter.call(this);

	// todo: this should probably be in a try/catch. Not sure how to surface errors
	// outside of the service though...
	this.accounts = this._readAccountsFromDisk();

	this.providers = bondCore.providers.list();

	this.getProvider = function(providerId) {
		return bondCore.providers.get(providerId);
	};
}
util.inherits(AccountSettingsService, EventEmitter);

/**
 * Fetches the accounts data directly from disk (intended for internal use only).
 */
AccountSettingsService.prototype._readAccountsFromDisk = function() {
	var rawData = userData.readFileSync('accounts.json');

	if (!rawData || !rawData.length) return [];

	// todo: try/catc - need to figure out how to surface errors though
	var data = JSON.parse(rawData),
		accounts = data.accounts || [];

	decodePasswords(accounts);

	return accounts;
};

/**
 * Syncs the accounts array back to disk.
 */
AccountSettingsService.prototype.saveAccounts = function() {
	encodePasswords(this.accounts);

	var data = {
		version: CURRENT_FILE_VERSION,
		accounts: this.accounts
	};

	var strAccounts = angular.toJson(data, true);

	// todo: same as above... needs a try/catch, but don't know what to do once
	// we have the error.
	userData.writeFileSync('accounts.json', strAccounts);

	// decode passwords again for anyone who still has an in-memory reference
	decodePasswords(this.accounts);
};

bond.service('accountSettings', AccountSettingsService);

function encodePasswords(accounts) {
	accounts.forEach(function(account) {
		account.password = new Buffer(account.password).toString('base64');
	});
}

function decodePasswords(accounts) {
	accounts.forEach(function(account) {
		account.password = new Buffer(account.password, 'base64').toString('utf8');
	});
}