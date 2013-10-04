var util = require('util');

function ContactService(accounts) {
}

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
