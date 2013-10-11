var util = require('util');

function ContactService(accounts) {
	var self = this;

	this.roster = [];
	this._rosterMap = {};

	// accounts.readStream.filter(function(event) {
	// 	return event.type === 'buddy';
	// }).onValue(function(event) {
	// 	self.handleBuddyEvent(event);
	// });
	
	accounts.readStream.filter(function(event) {
		return event.type === 'roster';
	}).onValue(function(event) {
		self.handleRosterEvent(event);
	});
}

ContactService.prototype.handleRosterEvent = function(event) {
	var self = this;

	this.roster.length = 0;
	this._rosterMap = {};

	event.data.forEach(function(contact) {
		contact.state = 'offline';
		contact.statusText = '';
		self._rosterMap[contact.jid];
		self.roster.push(contact);
	});
};

// ContactService.prototype.handleBuddyEvent = function(event) {
// 	var contact = this._contactsMap[event.from];
// 	if (!contact) {
// 		contact = this._contactsMap[event.from] = { jid: event.from };
// 		this.contacts.push(contact);
// 	}

// 	contact.state = event.state;
// 	contact.statusText = event.statusText;
// };

bond.service('contact', ContactService);
