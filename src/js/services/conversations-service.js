var EventEmitter = require('events').EventEmitter,
	util = require('util');

function ConversationsService(accounts) {
	EventEmitter.call(this);

	this.conversations = [{
		jid: "0stnhj0jmj3tq1ev7jcu6i11fu@public.talk.google.com",
		messages: []
	}];

	accounts.on('chat', this.handleChatEvent.bind(this));

	accounts.on('stanza', function(event) {
		if (event.data.name === 'message')
			console.log('stanza', event);
	})
}
util.inherits(ConversationsService, EventEmitter);

ConversationsService.prototype.handleChatEvent = function(event) {
	console.log('CHAT!', event);
};

bond.service('conversations', ConversationsService);
