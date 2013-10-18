var EventEmitter = require('events').EventEmitter,
	util = require('util');

function ContactService(accounts) {
	EventEmitter.call(this);

	this.roster = [];
	this._rosterMap = {};

	accounts.on('roster', this.handleRosterEvent.bind(this));

	accounts.on('buddy-state', this.handleBuddyStateEvent.bind(this));
}
util.inherits(ContactService, EventEmitter);

ContactService.prototype.handleRosterEvent = function(event) {
	var self = this;

	this.roster.length = 0;
	this._rosterMap = {};

	event.data.forEach(function(contact) {
		contact.state = 'offline';
		contact.statusText = '';
		contact.clients = {};
		self._rosterMap[contact.jid] = contact;
		self.roster.push(contact);
	});

	this.emit('roster-change');
};

ContactService.prototype.handleBuddyStateEvent = function(event) {
	var self = this,
		jid = event.data.jid,
		clientId = event.data.clientId;

	var contact = this._rosterMap[jid];
	if (!contact) {
		console.log('Buddy state received, but jid not in roster', jid);
		return;
	}

	contact.clients[clientId] = {
		statusText: event.data.statusText,
		state: event.data.state
	};

	console.log(contact.name, jid, JSON.stringify(contact.clients, null, 4));

	// determine which client's state/statusText to display at contact level
	var topClient = Object.keys(contact.clients).map(function(id) {
		return contact.clients[id];
	}).reduce(function (prev, cur) {
		var prevScore = ContactService.getStateScore(prev.state),
			curScore = ContactService.getStateScore(cur.state);

		return prevScore > curScore ? prev : cur;
	}, {})

	contact.statusText = topClient.statusText;
	contact.state = topClient.state;

	this.emit('roster-change');
};

ContactService.getStateScore = function(state) {
	if (state === 'online') return 10;
	if (state === 'away') return 9;
	if (state === 'dnd') return 8;
	if (state === 'offline') return 7;
	return 0;
}

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
