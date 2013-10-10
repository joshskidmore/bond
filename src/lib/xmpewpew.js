var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	xmpp = require('node-xmpp');

// simple helper for create incremental ids
var curId = 0,
	newId = function() { return curId++; };

// todo: handle disconnects (intentional and incidental) and reconnects

/**
 * Constructs a new XMPewPew instance.
 */
function XMPewPew(opts) {
	EventEmitter.call(this);

	// connection options
	this.jid = opts.jid;
	this.password = opts.password;
	this.host = opts.host;
	this.port = opts.port;
	this.autoReconnect = opts.autoReconnect;

	// initialized in #connect()
	this.conn = null;

	// various state trackers
	this.isConnected = false;
	this.rosterPending = false;

	// a list of commands waiting to be executed once a connection is
	// (re)established
	this.commandQueue = [];

}
util.inherits(XMPewPew, EventEmitter);

/**
 * Uses the connection info provided to the constructor to create an actual
 * connection.  Once the connection is established, an 'online' event will be
 * emitted.
 */
XMPewPew.prototype.connect = function() {
	var self = this;

	if (this.isConnected) return;

	var conn = this.conn = new xmpp.Client({
		jid: this.jid,
		password: this.password,
		host: this.host,
		port: this.port
	});

	conn.on('online', function() {
		conn.send(self.createPresenceElement());

		self.isConnected = true;

		self.emit('online');

		self.processQueuedCommands();
	});

	conn.on('stanza', this.handleStanza.bind(this));
};

/**
 * Causes a roster request to be initiated.  Once the roster is returned, a
 * 'roster' event will be emitted.  If a roster request is already pending, then
 * no new request will be created.
 */
XMPewPew.prototype.getRoster = function() {
	var self = this;
	this.whenReady(function() {
		if (self.rosterPending) return;
		self.conn.send(self.createRosterElement());
	});
};

/**
 * Essentially a dispatch method for incoming node-xmpp stanzas.  This will emit
 * a 'stanza' event, and then forward the stanza to a more specific method to be
 * handled.
 */
XMPewPew.prototype.handleStanza = function(stanza) {
	// emit the raw stanza
	this.emit('stanza', stanza);

	switch (stanza.name) {
		case 'iq':
			if (/^roster/.test(stanza.attrs.id)) {
				this.handleRosterStanza(stanza);
			}
			break;
		case 'presence':

			break;
		case 'message':

			break;
		default:
			console.log('Unrecognized stanza:', stanza);
	}
};

/**
 * Handles incoming roster stanza
 */
XMPewPew.prototype.handleRosterStanza = function(stanza) {
	var roster = stanza.getChild('query').children.map(function(item) {
		var jid = item.attrs.jid,
			groupTag = item.getChild('group');

		return {
			jid: jid,
			name: item.attrs.name || jid,
			subscription: item.attrs.subscription,
			group: groupTag ? groupTag.children[0] : null
		};
	});

	this.emit('roster', roster);
};

/**
 * Runs the provided command if and when this XMPewPew instance is ready
 * (i.e., connected)
 */
XMPewPew.prototype.whenReady = function(command) {
	if (this.isConnected) return command();
	this.commandQueue.push(command);
};

/**
 * Invokes all queued commands and resets the queue. This should be run whenever
 * a connection is (re)established.
 * 
 */
XMPewPew.prototype.processQueuedCommands = function() {
	this.commandQueue.forEach(function(command) { command(); });
	this.commandQueue.length = 0;
};

//
// XML generation methods
//

/**
 * Creates a presence element.
 */
XMPewPew.prototype.createPresenceElement = function() {
	return new xmpp.Element('presence');
};

/**
 * Creates a roster element.
 */
XMPewPew.prototype.createRosterElement = function() {
	var id = 'roster-' + newId();

	var roster = new xmpp.Element('iq', { id: id, type: 'get' });
	roster.c('query', { xmlns: 'jabber:iq:roster' });

	return roster;
};

module.exports = XMPewPew;