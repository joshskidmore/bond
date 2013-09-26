
/*
 * Bond GTalk Provider
 */


var bondCore = require('../../'),
	sys = require('sys'),
	EventEmitter = require('events').EventEmitter,
	_ = require('underscore'),
	xmpp = require('node-xmpp'),
	bacon = require('baconjs').Bacon;

exports.id = 'gtalknonoauth';
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



	/**
	 * Starts incoming Bond event
	 */
	var startIncomingBondEvent = function(stanza) {
		var	from = stanza.attrs.from ? stanza.attrs.from.split('/') : [null, null],
			to = stanza.attrs.to ? stanza.attrs.to.split('/') : [null, null];

		return {
			timestamp: new Date(),
			raw: stanza,
			from: from[0],
			fromResource: from[1],
			to: to[0],
			toResource: to[1]
		};
	};


	/**
	 * Updates user from an IQ roster query
	 */
	var updateUsersFromIQQuery = function(query) {
		query.children.forEach(function(user) {
			if (!user.attrs.jid || !user.attrs.name)  return;

			if (!self._users[user.attrs.jid])
				self._users[user.attrs.jid] = userObj = {};


			userObj.nick = user.attrs.name;
			userObj.group = user.getChild('group').getText();
		});
	};


	/**
	 * Converts incoming IQ event to incoming Bond event
	 */
	var iqStanzaToIncomingBondEvent = function(stanza) {
		var iq = { type: 'iq' },
			query = stanza.getChild('query'),
			vcard = stanza.getChild('vCard');

		if (query) {
			iq.subType = 'query';
		    iq.ns = query.getNS();
		    iq.query = query;
		    updateUsersFromIQQuery(iq.query);
		} else if (vcard) {
			iq.subType = 'vcard';
			iq.vcard = {
				name: vcard.getChild('FN').getText(),
				from: stanza.from,
				photo: typeof vcard.getChild('PHOTO').getChild('EXTVAL') !== 'undefined' ? vcard.getChild('PHOTO').getChild('EXTVAL').getText() : ''
			}
		} else {
			iq.subType = 'unknown';
		}

		return _.extend(
			stanza.defaults,
			{ user: getUserInfo(stanza.defaults.from) },
			iq
		);
	};


	/**
	 * Returns a messagaging client
	 */
	var getMessagingClient = function(clientName) {

		var clients = {
			'http://pidgin.im/':											{ client: 'Pidgin' },
			'http://mail.google.com/xmpp/client/caps':						{ client: 'gMail (Web)', type: 'desktop' },
			'http://www.android.com/gtalk/client/caps':						{ client: 'Google Talk (Android)', type: 'mobile' },
			'http://www.android.com/gtalk/client/caps2':					{ client: 'Google Talk (Android) (CAPS2)', type: 'mobile' },
			'http://www.apple.com/ichat/caps':								{ client: 'Apple iChat', type: 'desktop' },
			'http://www.google.com/xmpp/client/caps':						{ client: 'Google Talk', type: 'desktop' },

			'adium':														{ client: 'Adium', type: 'desktop' },
			'beejive':														{ client: 'Beejive', type: 'mobile' },
			'imo':															{ client: 'IMO', type: 'mobile' },
			'bot-generic':													{ type: 'bot' }
		}
		
		return clients[clientName] || {};
	};


	/**
	 * Updates user's information from stanza
	 */
	var updateUserFromStanza = function(stanza) {
		if (!self._users[stanza.defaults.from])
			self._users[stanza.defaults.from] = {};

		var _client = {},
			resourceName = stanza.defaults.fromResource;

		if (!self._users[stanza.defaults.from][resourceName])
			self._users[stanza.defaults.from][resourceName] = {};

		var user = self._users[stanza.defaults.from],
			resource = self._users[stanza.defaults.from][resourceName];

		if (stanza.getChild('show'))
			resource.show = stanza.getChild('show').getText();

		if (stanza.getChild('nick'))
			user.nick = stanza.getChild('nick').getText();

		if (stanza.getChild('priority'))
			resource.priority = +stanza.getChild('priority').getText();

		if (stanza.getChild('status'))
			resource.status = stanza.getChild('status').getText();

		// if (stanza.getChild('x') && stanza.getChild('x').getChild('photo')) {
		// 	console.log( stanza.getChild('x').getChild('photo').getText() );
		// }

		if (stanza.getChild('c')) {
			var attrs = stanza.getChild('c').attrs;

			if (attrs.ext) 
				resource.capabilities = attrs.ext.split(/ /g);

			if (attrs.node) {
				_client = getMessagingClient(attrs.node);
			}

		}


		if (resourceName.match(/adium/i))			_client = getMessagingClient('adium');
		else if (resourceName.match(/beejive/i))	_client = getMessagingClient('beejive');
		else if (resourceName.match(/^imo/))		_client = getMessagingClient('imo');
		else if (resourceName.match(/bot/g))		_client = getMessagingClient('bot-generic');

		resource = _.extend(resource, _client);
	};


	/**
	 * Returns user info based on userId
	 */
	var getUserInfo = function(userId) { 
		if (!userId || !self._users[userId])  return {};

		return self._users[userId];
	};


	/**
	 * Converts incoming presence event to incoming Bond event
	 */
	var presenceStanzaToIncomingBondEvent = function(stanza) {
		var status = ( stanza.getChild('show')) ? stanza.getChild('show').getText() : 'online';
		status = (status === 'chat') ? 'online' : status;
		status = (stanza.attrs.type === 'unavailable') ? 'offline' : status;

		updateUserFromStanza(stanza);

		return _.extend(
			stanza.defaults,
			{ user: getUserInfo(stanza.defaults.from) },
			{
				type: 'activity',
				status: status
			}
		);
	};


	/**
	 * Converts incoming message stanza to incoming Bond event
	 */
	var messageStanzaToIncomingBondEvent = function(stanza) {
		return _.extend(
			stanza.defaults,
			{ user: getUserInfo(stanza.defaults.from) },
			{
				type: 'message',
				message: stanza.getChild('body') ?  stanza.getChild('body').getText() : null
			}
		);
	};


	/**
	 * Converts activity/typing stanza to incoming Bond event
	 */
	var activityStanzaToIncomingBondEvent = function(stanza) {
		return _.extend(
			stanza.defaults,
			{ user: getUserInfo(stanza.defaults.from) },
			{
				type: 'activity',
				status: stanza.children[0].name // @todo 'cha:'
			}
		);
	};


	/**
	 * Converts incoming stanza to incoming Bond event
	 */
	var stanzaToIncomingBondEvent = function(stanza) {
		stanza.defaults = startIncomingBondEvent(stanza);


		if ( stanza.is('iq') )
			return iqStanzaToIncomingBondEvent(stanza);

		else if ( stanza.is('presence') )
			return presenceStanzaToIncomingBondEvent(stanza);

		else if ( stanza.is('message') && stanza.attrs.type === 'chat' && stanza.getChild('body'))
			return messageStanzaToIncomingBondEvent(stanza);

		else if ( stanza.is('message') && stanza.attrs.type === 'chat')
			return activityStanzaToIncomingBondEvent(stanza);
		
		return; //@todo
	};

	
	// Start incomingBonEvent stream
	self.bondIncomingEventStream = bacon
		.fromEventTarget(client, 'stanza')
		.map(stanzaToIncomingBondEvent);




	/**
	 * Sends a raw XMPP stanza to the client
	 */
	self.sendRawXmppStanza = function(message) {
		client.send(message);  // @todo - validation

		self.emit('messageOut', {
			type: 'rawXmpp',
			message: message
		});
	};



	/**
	 * Sends a formatted message to a user
	 */
	self.sendMessage = function(message) {
		if (!message.to || !message.message)  return;

		var stanza = new xmpp.Element('message', { to: message.to, type: 'chat' }).c('body').t(message.message);

		self.sendRawXmppStanza(stanza);

		// self.emit('messageOut', {
		// 	type: 'chat',
		// 	message: message
		// });
	};



	/**
	 * Converts message to outgoing Bond event
	 */
	var messagetoOutgoingBondEvent = function(message) {

		var defaults = {
			timestamp: new Date(),
			raw: message,
			// from: from[0],
			// fromResource: from[1],
			// to: to[0],
			// toResource: to[1]
		}
		
		return _.extend(defaults, message);
	};



	// Outgoing message stream
	self.bondOutgoingEventStream = bacon
		.fromEventTarget(self, 'messageOut')
		.map(messagetoOutgoingBondEvent);
		//.merge(bacon.fromEventTarget(self, 'rawMessageOut'));



	// Event: error
	client.on('error', function(e) {
		self.emit('error', e);
	});


	// Event: connect
	client.on('online', function() {
		// update presence
		self.sendRawXmppStanza( new xmpp.Element('presence') );

		// request roster
		self.sendRawXmppStanza( new xmpp.Element( 'iq', { type: 'get' }).c('query', { xmlns: 'jabber:iq:roster'}) );

		// testing vcard
		//self.sendRawXmppStanza( new xmpp.Element( 'iq', { type: 'get', to: 'jeremy.martin@sparcedge.com' }).c('vCard', { xmlns: 'vcard-temp'}) );
		
		self.emit('connect');
	});
	

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



// Updates user's status
Client.prototype.updateStatus = function(statusUpdate, cb) {
	var self = this;

	cb(null, statusUpdate);
};
