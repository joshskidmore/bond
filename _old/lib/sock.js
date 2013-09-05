
var sockjs = require('sockjs'),
	bond = require('./');


exports.connections = [];


// occurs when a sockjs client connects
exports.onConnect = function(connection, cb) {
	var out = { accounts: {} };

	for (accountId in bond.accounts) {
		var account = bond.accounts[accountId];
		
		if (!account.online) return;

		out.accounts[accountId] = {
			service: account.config.service,
			username: account.config.username,
			users: account.client.online
		};
	}

	cb(null, out);
};




// socket write from server to client
exports.message = function(msg) {
	exports.connections.forEach(function(conn) {
		conn.write(JSON.stringify(msg));
	});
};




// initialize sockjs server
exports.init = function(httpServer, cb) {

	var client = sockjs.createServer({ sockjs_url: '/js/sockjs-0.3.4.17.g95f4.js' });

	client.on('connection', function(connection) {
		exports.connections.push(connection);

		// send status
		bond.sock.onConnect(connection, function(e, d) {
			bond.sock.message({
				t: 'init',
				e: d
			});

			connection.on('data', function(m) {
				var msg = JSON.parse(m);
				
				if (msg.type === 'message') {
					bond.accounts[msg.accountId].client.message(msg.userId,msg.message);
				}
			});

			connection.on('close', function() {
				console.log('Connection closed.');
			});

			console.log('New socket connection');
		});

	});

	client.installHandlers(httpServer, { prefix:'/bond'} );

	httpServer.listen(9999, '127.0.0.1');
	exports.client = client;

	cb(null, client);
};
