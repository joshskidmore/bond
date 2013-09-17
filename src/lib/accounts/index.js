
var bondCore = require('../'),
	accounts = {};


/**
 * Lists all connected accounts
 */
exports.list = function() {
	if (!accounts)  return;
	return accounts;
};


/**
 * Get a connected account by ID
 */
exports.get = function(accountId) {	
	if (!accounts[accountId])  return;
	return accounts[accountId];
};


/**
 * Connect an account
 */
exports.connect = function(accountConfig, cb) {
	cb = cb ? cb : function(e, r) { return e ? e : r; };

	var accountId = accountConfig.label || (accountConfig.service + '-' + accountConfig.username);

	// initialize client (but not connect)
	accounts[accountId] = new bondCore.providers.clients[accountConfig.service].Client(accountConfig);  // @todo - naive assumption this will work :)

	return accounts[accountId].connect(function(e, account) {
		return cb(null, accounts[accountId]);
	});	
};


/**
 * Discconect an account
 */
exports.disconnect = function(accountId) {
}
