var fs = require('fs'),
	path = require('path');

module.exports = getChatProviders();

function ChatProvider(config) {
	this.id = config.id;
	this.name = config.name;
	this.options = config.options;
	this.xmppSettings = config.xmpp;
}

ChatProvider.prototype.getOptionsAsList = function() {
	var opts = this.options;
	return Object.keys(opts).map(function(key) {
		var opt = opts[key];
		return {
			key: key,
			type: opt.type,
			default: opt.default,
			label: opt.label
		};
	});
};

function getChatProviders() {
	return fs.readdirSync(path.resolve(__dirname, 'chat-providers'))
		.map(function(fileName) {
			return fs.readFileSync(path.resolve(__dirname, 'chat-providers', fileName), 'utf8');
		}).map(function(providerJson) {
			return JSON.parse(providerJson);
		}).reduce(function(providers, providerConfig) {
			providers[providerConfig.id] = new ChatProvider(providerConfig);
			return providers;
		}, {});
}