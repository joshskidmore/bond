var util = require('util');

function ContactService(accounts) {
	this.roster = [];
	this._rosterMap = {};

	accounts.on('roster', this.handleRosterEvent.bind(this));

	accounts.on('buddy-state', this.handleBuddyStateEvent.bind(this));
}

ContactService.prototype.handleRosterEvent = function(event) {
	var self = this;

	this.roster.length = 0;
	this._rosterMap = {};

	event.data.forEach(function(contact) {
		contact.state = 'offline';
		contact.statusText = '';
		self._rosterMap[contact.jid] = contact;
		self.roster.push(contact);
	});
};

ContactService.prototype.handleBuddyStateEvent = function(event) {
	var self = this,
		jid = event.data.jid;

	var contact = this._rosterMap[jid];
	if (!contact) {
		console.log('Buddy state received, but jid not in roster', jid);
		return;
	}
	contact.statusText = event.data.statusText;
	contact.state = event.data.state;
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
