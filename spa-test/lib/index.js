
 //  ____                  _ 
 // |  _ \                | |
 // | |_) | ___  _ __   __| |
 // |  _ < / _ \| '_ \ / _` |
 // | |_) | (_) | | | | (_| |
 // |____/ \___/|_| |_|\__,_|


var fs = require('fs'),
	sys = require('sys'),
	events = require('events'),
	_ = require('underscore'),
	bond = require('./');


exports.gui = require('./gui');
exports.services = require('./services');



// universal event handler
var EventManager = function() {
	var self = this;

	self.notify = function(type, accountId, event) {
		event.accountId = accountId;

		console.log('event: ' + JSON.stringify(event));
		
		// event specific event type
		self.emit(type, event);
		
		// emit 'all' event (for debugging)
		event.type = type;
		self.emit('all',event);
	}

};

sys.inherits(EventManager, events.EventEmitter);




exports.init = function(_nwGui) {

	// export nw.gui
	var nwGui = exports.nwGui = _nwGui;

	// gui init (lets get this over with)
	bond.gui.init(nwGui);

	// load accounts
	bond.loadAccounts();

	// event manager
	exports.eventManager = new EventManager();
};






exports.accounts = {};

exports.loadAccounts = function() {

	fs.readdirSync(__dirname + '/../config/accounts')
		.forEach(function(fileName) {
			
			var account = require(__dirname + '/../config/accounts/' + fileName),
				accountId = account.label || account.username + '-' + account.service;


			// @todo	!!! BIG FAIL - handle error conditions if
			// 			account configs aren't formatted correctly!!!


			if (bond.accounts[accountId]) return;
			if (account.connectOnStartup === false) return;


			// @todo - load each account based on service (hardcoded to gtalk currently)
			var client = new bond.services.GTalk();

			// connect client
			client.connect({
				username: account.username,
				password: account.password
			});

			// pipe messages to universal event handler
			// @todo - cleanup events in general; lots of redundancy
			client.on('connected',function(ev) { bond.eventManager.notify('connected', accountId, ev) });
			client.on('presence', function(ev) { bond.eventManager.notify('presence', accountId, ev) });
			client.on('typing', function(ev) { bond.eventManager.notify('typing', accountId, ev) });
			client.on('message', function(ev) { bond.eventManager.notify('message', accountId, ev) });
			client.on('error', function(ev) { bond.eventManager.notify('error', accountId, ev) });


			exports.accounts[accountId] = {
				config: account,
				client: client
			};
		});

};