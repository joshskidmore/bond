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
		['online', 'roster', 'buddy-state', 'chat', 'stanza'].forEach(function(evtName) {
			account.on(evtName, self.emit.bind(self, evtName));
		});
		account.options.connectOnStartup && account.connect();
	});
}
util.inherits(AccountService, EventEmitter);

AccountService.prototype.getAccount = function(accountJid) {
	var accounts = this.accounts;
	for (var i = 0, len = accounts.length; i < len; i++) {
		var account = accounts[i];
		if (account.jid === accountJid) {
			return account;
		}
	}
	return null;
};

bond.service('accounts', AccountService);
