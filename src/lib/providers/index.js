
var clients = exports.clients = require('./clients');


/**
 * List all providers
 */
exports.list = function() {
	if (!clients)  return;
	
	return clients;
};


/**
 * Get a provider by ID
 */
exports.get = function(clientId) {
	if (!clients || !clients[clientId])  return;

	return clients[clientId];
};
