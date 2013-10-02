var util = require('util'),
	EventEmitter = require('events').EventEmitter;

function ContactService(accounts) {
	EventEmitter.call(this);

}
util.inherits(ContactService, EventEmitter);

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
