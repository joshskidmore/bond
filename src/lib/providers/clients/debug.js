
/*
 * Bond Debug Provider
 */


var bondCore = require('../../'),
	sys = require('sys'),
	EventEmitter = require('events').EventEmitter,
	_ = require('underscore'),
	xmpp = require('node-xmpp');

exports.id = 'debug';
exports.name = 'Debugging/Null Provider';
exports.description = 'Does not do anything!';
exports.version = 0.1;
var configurableOptions = exports.configurableOptions = [
	{ key: 'password',	type: 'password',	default: null,		label: 'Password' },
	{ key: 'someField',	type: 'text',		default: null,		label: 'Some Test Field' }
];


var defaultOptions = {};


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
	
	cb(null);
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