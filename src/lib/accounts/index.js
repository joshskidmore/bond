
var bondCore = require('../'),
	accounts = {},
	bacon = require('baconjs');


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

	return accounts[accountId].connect(function(e, client) {
		// @todo - error handling



		client.bondIncomingEventStream
			//.filter(function(bondEvent) { return bondEvent.type === 'iq' })
			.onValue(function(messageEvent) { 
				console.log('incoming', messageEvent);
			});



		client.bondOutgoingEventStream
			//.filter(function(bondEvent) { return bondEvent.type === 'activity' })
			.onValue(function(messageEvent) { 
				console.log('outgoing', messageEvent);
			});

		return cb(null);
	});	
};


/**
 * Discconect an account
 */
exports.disconnect = function(accountId) {
}
