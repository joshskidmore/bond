var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	xmpp = require('node-xmpp');

// simple helper for create incremental ids
var curId = 0,
	newId = function() { return curId++; };

// todo: handle disconnects (intentional and incidental) and reconnects

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

	// a list of commands waiting to be executed once a connection is
	// (re)established
	this.commandQueue = [];

}
util.inherits(XMPewPew, EventEmitter);

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
};

XMPewPew.prototype.getRoster = function(cb) {
	var roster = this.createRosterElement();

	conn.send(roster);
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