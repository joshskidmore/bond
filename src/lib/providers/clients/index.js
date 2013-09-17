
var fs = require('fs'),
	providers = {},
	// options required by every provider
	// @todo - quickfix; not right place/way to handle this :)

	requiredOptions = [
		{ key: 'reconnect',			type: 'bool', 	default: true, 		label: 'Automatically Reconnect'	},
		{ key: 'connectOnStartup', 	type: 'bool',	default: false,		label: 'Connect On Startup' 		},
		{ key: 'username',			type: 'text',	default: null,		label: 'Username' 					},
		{ key: 'label',				type: 'text',	default: null,		label: 'Label' 						}
	];


fs.readdirSync(__dirname)
	.forEach(function(fileName) {
		if (fileName === 'index.js')  return;
		
		var provider = providers[fileName.substr(0, fileName.length - 3).replace(/-/g,'')] = require('./' + fileName);

		requiredOptions.forEach(function(option) {
			provider.configurableOptions.unshift(option);
		});
	});


module.exports = providers;
