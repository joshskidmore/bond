var Account = require('./lib/account'),
	Bacon = require('baconjs').Bacon;

function AccountService(accountSettings) {
	var self = this;

	this.contacts = [];
	this.contactsMap = {};

	this.accounts = accountSettings.accounts.map(function(config) {
		return new Account(config);
	});

	this.accounts.forEach(function(account) {
		self.setupStreamHandlers(account.readStream);
		account.options.connectOnStartup && account.connect();
	});
}

AccountService.prototype.setupStreamHandlers = function(stream) {
	var self = this;

	stream.filter(function(event) {
		return event.type === 'buddy';
	}).onValue(function(event) {
		self.handleBuddyEvent(event);
	});
};

AccountService.prototype.handleBuddyEvent = function(event) {
	var contact = this.contactsMap[event.from];
	if (!contact) {
		contact = this.contactsMap[event.from] = { jid: event.from };
		this.contacts.push(contact);
	}

	contact.state = event.state;
	contact.statusText = event.statusText;
};

bond.service('accounts', AccountService);
