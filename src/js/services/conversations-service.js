(function() {
	var EventEmitter = require('events').EventEmitter,
		util = require('util');

	function ConversationsService(accounts, contact) {
		EventEmitter.call(this);

		this.contactService = contact;
		this.accountsService = accounts;

		this.conversations = [];

		accounts.on('chat', this.handleChatEvent.bind(this));
	}
	util.inherits(ConversationsService, EventEmitter);

	ConversationsService.prototype.handleChatEvent = function(event) {
		var conversation = this.getConversation(event.data.jid, event.accountJid);

		// todo: this probably means we didn't recognize the jid. What do we do here?
		if (!conversation) return;

		conversation.addMessage(event.data.message);

		this.emit('chat');
	};

	ConversationsService.prototype.startConversation = function(contact) {
		var conversation = this.getConversation(contact.jid, contact.accountJid);
		if (!conversation) {
			return console.log('Unable to initiate conversation with contact:', contact.jid);
		}
		this.emit('request-focus-conversation', conversation);
	};

	ConversationsService.prototype.getConversation = function(jid, accountJid) {
		for (var i = 0, len = this.conversations.length; i < len; i++) {
			var conversation = this.conversations[i];

			if (conversation.contact.jid === jid && conversation.account.jid === accountJid) {
				return conversation;
			}
		}

		var contact = this.contactService.getContact(jid);
		if (!contact) {
			return console.log('Received message from unknown jid: ', jid);
		}

		var account = this.accountsService.getAccount(accountJid);
		if (!account) {
			return console.log('Received messages for unknown account: ', accountJid);
		}

		var newConversation = new Conversation(account, contact);

		this.conversations.push(newConversation);

		this.emit('conversation', newConversation);

		return newConversation;
	};

	bond.service('conversations', ConversationsService);

	function Conversation(account, contact) {
		this.account = account;
		this.contact = contact;
		this.messages = [];
	}

	Conversation.prototype.sendMessage = function(message) {
		this.account.sendMessage(this.contact.jid, message);
		this.addMessage(message);
	};

	Conversation.prototype.addMessage = function(text) {
		this.messages.push(text);
	};

})();