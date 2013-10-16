var providers = require('./providers'),
	Bacon = require('baconjs').Bacon,
	XMPewPew = require('./xmpewpew');

function Account(config) {
	var self = this;

	this.options = config;
	this.jid = this.options.username;
	this.provider = providers[this.options.providerId];
	this.readStream = new Bacon.Bus();

	// set up our XMPewPew instance
	var xmpp = this.xmpp = new XMPewPew(this.getConnectionOptions());

	// automatically fetch roster
	xmpp.getRoster();

	xmpp.on('online', function() {
		self.pushEvent('online');
	});

	xmpp.on('roster', function(roster) {
		self.pushEvent('roster', roster);
	});

	xmpp.on('buddy-state', function(buddyState) {
		self.pushEvent('buddy-state', buddyState);
	});

	xmpp.on('stanza', function(stanza) {
		// console.log("STANZA: " + stanza.name);
		// console.log(stanza);
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

Account.prototype.pushEvent = function(type, data) {
	this.readStream.push({
		type: type,
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