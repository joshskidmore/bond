var Account = require('./lib/account'),
	Bacon = require('baconjs').Bacon;

function AccountService(accountSettings) {
	var self = this;

	this.readStream = new Bacon.Bus();

	this.accounts = accountSettings.accounts.map(function(config) {
		return new Account(config);
	});

	this.accounts.forEach(function(account) {
		self.readStream.plug(account.readStream);
		account.options.connectOnStartup && account.connect();
	});
}

bond.service('accounts', AccountService);
