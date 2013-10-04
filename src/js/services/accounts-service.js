var Account = require('./lib/account'),
	Bacon = require('baconjs').Bacon;

function AccountService(accountSettings) {
	this.accounts = accountSettings.accounts.map(function(config) {
		return new Account(config);
	});

	this.accounts.filter(function(account) {
		return account.options.connectOnStartup;
	}).forEach(function(account) {
		account.connect();
		account.readStream.log();
	});
}

bond.service('accounts', AccountService);
