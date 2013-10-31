var EventEmitter = require('events').EventEmitter,
	util = require('util');

function ConversationsService(accounts, contact) {
	EventEmitter.call(this);

	this.contactService = contact;

	this.conversations = [];

	accounts.on('chat', this.handleChatEvent.bind(this));
}
util.inherits(ConversationsService, EventEmitter);

ConversationsService.prototype.handleChatEvent = function(event) {
	var conversation = this.getConversation(event.data.jid, event.accountJid);

	// todo: this probably means we didn't recognize the jid. What do we do here?
	if (!conversation) return;

	conversation.messages.push(event.data.message);

	this.emit('chat');
};

ConversationsService.prototype.getConversation = function(fromJid, toJid) {
	for (var i = 0, len = this.conversations.length; i < len; i++) {
		var conversation = this.conversations[i];

		if (conversation.from.jid === fromJid && conversation.accountJid === toJid) {
			return conversation;
		}
	}

	var contact = this.contactService.getContact(fromJid);

	if (!contact) {
		return console.log('Received message from unknown jid: ', fromJid);
	}

	var newConversation = {
		accountJid: toJid,
		from: contact,
		messages: []
	};
	this.conversations.push(newConversation);

	this.emit('conversation', newConversation);

	return newConversation;
};

bond.service('conversations', ConversationsService);
