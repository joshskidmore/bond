
/*
 * Bond GTalk Provider
 */


var bondCore = require('../../'),
	sys = require('sys'),
	EventEmitter = require('events').EventEmitter,
	_ = require('underscore'),
	xmpp = require('node-xmpp');


exports.name = 'gTalk (Non-oAuth)';
exports.description = 'Early version of Google Talk Without OAuth (only requires password)';
exports.version = 0.1;
var configurableOptions = exports.configurableOptions = [
	{ key: 'password',	type: 'password',	default: null,		label: 'Password' }
];


var defaultOptions = {
	hostname: 'talk.google.com',
	port: 5222
};


var Client = exports.Client = function(options) {
	EventEmitter.call(this);

	var _configurableOptions = {};
	configurableOptions.forEach(function(o) {
		_configurableOptions[o.key] = o.default;
	});


	this._users = {};
	this._options = _.extend(_configurableOptions, defaultOptions, options);
};

sys.inherits(Client, EventEmitter);






// Connect
Client.prototype.connect = function(cb) {
	var self = this;

	// New node-xmpp client
	var client = new xmpp.Client({
		jid: self._options.username,
		password: self._options.password,
		host: self._options.hostname,
		port: self._options.port
	});

	// Event: error
	client.on('error', function(e) {
		self.emit('error', e);
	});

	// Event: connect
	client.on('online', function() {
		client.send( new xmpp.Element('presence') );
		self.emit('connect');
	});


	client.on('stanza', function(stanza) {
		var person = stanza.attrs.from.split('/'),
			id = person[0],
			resource = person[1];

		if (stanza.is('iq')) {
			// @todo
		} else if (stanza.is('presence')) {
			var state = ( stanza.getChild('show')) ? stanza.getChild('show').getText() : 'online';
			state = (state === 'chat') ? 'online' : state;
			state = (stanza.attrs.type === 'unavailable') ? 'offline' : state;

			// Event: statusUpdate
			self.emit('statusUpdate', {
				user: id,
				userResource: resource,
				status: state
			});
		} else if (stanza.is('message')) {
			
			if (stanza.attrs.type === 'chat') {
				if (stanza.getChild('body')) {
					self.emit('message', {
						user: id,
						userResource: resource,
						type: 'in',
						message: stanza.getChild('body').getText()
					});
				} else if (stanza.children[0].name === 'cha:composing') {
					self.emit('typing', {
						user: id,
						userResource: resource,
						status: 'active'
					});
				} else if (stanza.children[0].name === 'cha:paused') {
					self.emit('typing', {
						user: id,
						status: 'paused'
					});
				} else {
					// @todo
				}

			}
		} else {
			// @todo
		}
	});

	
	// add xmpp client to self
	self.xmppClient = client;

	return cb(null, self);
};


// Disconnect
Client.prototype.disconnect = function(cb) {
	var self = this;

	// @todo

	delete self;
	cb(null);
};


// Send message
Client.prototype.message = function(message, cb) {
	var self = this;

	cb(null, message);
};


// Updates user's status
Client.prototype.updateStatus = function(statusUpdate, cb) {
	var self = this;

	cb(null, statusUpdate);
};
