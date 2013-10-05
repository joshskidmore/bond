var util = require('util');

function ContactService(accounts) {
	var self = this;

	this.contacts = [];
	this._contactsMap = {};

	accounts.readStream.filter(function(event) {
		return event.type === 'buddy';
	}).onValue(function(event) {
		self.handleBuddyEvent(event);
	});
}

ContactService.prototype.handleBuddyEvent = function(event) {
	var contact = this._contactsMap[event.from];
	if (!contact) {
		contact = this._contactsMap[event.from] = { jid: event.from };
		this.contacts.push(contact);
	}

	contact.state = event.state;
	contact.statusText = event.statusText;
};

ContactService.prototype.getOnlineContacts = function() {
	return [
		{ provider: 'gtalk', name: 'Josh Skidmore' },
		{ provider: 'gtalk', name: 'Jeremy Martin' },
		{ provider: 'aim', name: 'Bryan Gilbert' },
		{ provider: 'ruff', name: 'Gus' },
		{ provider: 'gtalk', name: 'Bob Williams' }
	];
};

bond.service('contact', ContactService);
