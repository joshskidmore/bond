
var fs = require('fs'),
	bond = require('./');

exports.sock = require('./sock');
exports.services = require('./services');







exports.accounts = {};


// universal event handler
exports.events = {
	connected: function(accountId, event) {
		exports.accounts[accountId].online = true;
		
		// @todo - error handling

		console.log('Connected to ' + accountId);
		bond.sock.message({
			t: 'connected',
			a: accountId,
			e: event
		});
	},
	typing: function(accountId, event) {
		bond.sock.message({
			t: 'typing',
			a: accountId,
			e: event
		});
	},
	message: function(accountId, event) {
		bond.sock.message({
			t: 'message',
			a: accountId,
			e: event
		});
	},
	error: function(accountId, event) {
		bond.sock.message({
			t: 'error',
			a: accountId,
			e: event
		});
	},
	presence: function(accountId, event) {
		bond.sock.message({
			t: 'presence',
			a: accountId,
			e: event
		});
	}
};




exports.loadAccounts = function() {

	fs.readdirSync(__dirname + '/../config/accounts')
		.forEach(function(fileName) {
			
			var account = require(__dirname + '/../config/accounts/' + fileName),
				accountId = account.username + '-' + account.service;


			// @todo	!!! BIG FAIL - handle error conditions if
			// 			account configs aren't formatted correctly!!!


			if (bond.accounts[accountId]) return;
			if (account.connectOnStartup === false) return;


			// @todo - load each account based on service (hardcoded to gtalk currently)
			var client = new bond.services.GTalk();

			// connect client
			client.connect({
				username: account.username,
				password: account.password
			});

			// pipe messages to universal event handler
			// @todo - cleanup events in general; lots of redundancy
			client.on('connected',function(ev) { bond.events.connected(accountId, ev) });
			client.on('presence', function(ev) { bond.events.presence(accountId, ev) });
			client.on('typing', function(ev) { bond.events.typing(accountId, ev) });
			client.on('message', function(ev) { bond.events.message(accountId, ev) });
			client.on('error', function(ev) { bond.events.error(accountId, ev) });


			exports.accounts[accountId] = {
				config: account,
				client: client
			};
		});

};
