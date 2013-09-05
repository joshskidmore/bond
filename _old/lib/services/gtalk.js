

var sys = require('sys'),
	_ = require('underscore'),
	xmpp = require('node-xmpp');


var GTalk = module.exports = function GTalk() {

	this.options = {
		connected: false,
		hostname: 'talk.google.com',
		port: 5222,
		username: null,
		password: null,
		reconnect: true
	};
	
	// list of users 
	// @todo - rename to 'users'
	this.online = {};
};

sys.inherits(GTalk, require('events').EventEmitter);


// method to get users
GTalk.prototype.getUsers = function() {
	return this.online;
};


// send message to user
// @todo - group messages
GTalk.prototype.message = function(user, msg) {
	var self = this;

	var stanza = new xmpp.Element('message', { to: user, type: 'chat' });
	stanza.c('body').t(msg);

	self.client.send(stanza);

	// @todo - should this be here? 
	self.emit('message', {
		to: user,
		from: '',
		resource: '',
		message: msg,
		type: 'out'
	});
};


// connect client to service
GTalk.prototype.connect = function(_options) {
	var self = this;

	// extend service options with connection-specific options 
	if (_options)  self.options = _.extend(self.options, _options);

	// connect client
	var client = new xmpp.Client({
		jid: this.options.username,
		password: this.options.password,
		host: this.options.hostname,
		port: this.options.port,
		reconnect: true
	});

	// disconnected event
	client.on('disconnect', function() {
		self.emit('disconnected');
	});

	// @todo - probably should not be disconnected event
	client.on('offline', function() {
		self.emit('disconnected');
	});

	// connected event
	client.on('online', function() {
		client.send( new xmpp.Element('presence') );

		setTimeout(function() {
			self.ready = true;
			self.emit('connected', { users: self.online });
		}, 3000);

		
	});

	// error event
	client.on('error', function() {
		self.emit('error');
	});


	client.on('stanza', function(stanza) {
		var person = stanza.attrs.from.split('/'),
			id = person[0],
			resource = person[1];

		if (stanza.is('iq')) {
			// @todo - learn what this is...
		} else if (stanza.is('presence')) {
			var state = ( stanza.getChild('show')) ? stanza.getChild('show').getText() : 'online';
			state = (state === 'chat') ? 'online' : state;
			state = (stanza.attrs.type === 'unavailable') ? 'offline' : state;

			if (!self.online[id])
				self.online[id] = {};

			if (!self.online[id][resource])
				self.online[id][resource] = state;

			if (self.ready) {
				self.emit('presence', {
					to: stanza.to,
					from: id,
					resource: resource,
					status: state
				});	
			}
			

		} else if (stanza.is('message')) {
			
			if (stanza.attrs.type === 'chat') {
				if (stanza.getChild('body')) {
					self.emit('message', {
						to: stanza.to,
						from: id,
						resource: resource,
						type: 'in',
						message: stanza.getChild('body').getText()
					});
				} else if (stanza.children[0].name === 'cha:composing') {
					self.emit('typing', {
						to: stanza.to,
						from: id,
						status: 'active'
					});
				} else if (stanza.children[0].name === 'cha:paused') {
					self.emit('typing', {
						to: stanza.to,
						from: id,
						status: 'paused'
					});
				} else {
					console.log('other',stanza);
				}

			}
		} else {
			console.log('else',stanza);
		}

	});

	self.client = client;
};
