var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	providers = require('./providers'),
	XMPewPew = require('./xmpewpew');

function Account(config) {
	EventEmitter.call(this);

	var self = this;

	this.options = config;
	this.jid = this.options.username;
	this.provider = providers[this.options.providerId];

	// set up our XMPewPew instance
	var xmpp = this.xmpp = new XMPewPew(this.getConnectionOptions());

	// automatically fetch roster
	xmpp.getRoster();

	['online', 'roster', 'buddy-state', 'chat', 'stanza'].forEach(function(evtName) {
		xmpp.on(evtName, self.wrappedEmit.bind(self, evtName));
	});

	// xmpp.on('close', function() {
	// 	self.pushEvent('close');
	// });

	// xmpp.on('chat', function(from, message) {
	// 	self.pushEvent('chat', { from: from, message: message });
	// });

	// xmpp.on('chatstate', function(from, state) {
	// 	self.pushEvent('chatstate', { from: from, state: state });
	// });

	// xmpp.on('groupchat', function(conference, from, message, stamp) {
	// 	self.pushEvent('chatstate', {
	// 		conference: conference,
	// 		from: from,
	// 		message: message,
	// 		stamp: stamp
	// 	});
	// });

	// xmpp.on('buddy', function(jid, state, statusText) {
	// 	self.pushEvent('buddy', {
	// 		from: jid,
	// 		state: state,
	// 		statusText: statusText
	// 	});
	// });

	// xmpp.on('error', function(err) {
	// 	self.pushEvent('error', { err: err });
	// });
}
util.inherits(Account, EventEmitter);

Account.prototype.wrappedEmit = function(evtName, data) {
	this.emit(evtName, {
		accountJid: this.jid,
		data: data
	});
};

Account.prototype.getConnectionOptions = function() {
	return {
		jid: this.options.username,
		password: this.options.password,
		host: this.provider.xmppSettings.host,
		port: this.provider.xmppSettings.port
	};
};;

Account.prototype.connect = function() {
	this.xmpp.connect(this.getConnectionOptions());
};

module.exports = Account;