var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	Account = require('./lib/account');

function AccountService(accountSettings) {
	EventEmitter.call(this);

	var self = this;

	this.accounts = accountSettings.accounts.map(function(config) {
		return new Account(config);
	});

	this.accounts.forEach(function(account) {
		['online', 'roster', 'buddy-state', 'stanza'].forEach(function(evtName) {
			account.on(evtName, self.emit.bind(self, evtName));
		});
		account.options.connectOnStartup && account.connect();
	});
}
util.inherits(AccountService, EventEmitter);

bond.service('accounts', AccountService);
