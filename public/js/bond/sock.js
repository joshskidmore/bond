
$(function() {
	var connected = false;


	$('#send')
		.on('click',function() {
			console.log('clicked');
			var to = $('#to').val(),
				message = $('#message').val();

			if (to.length && message.length) {
				Bond.Message(to,message);
				console.log('ll',to,message);
			} else {
				console.log('no');
			}
		});

	$('#filter')
		.on('keyup', function() {
			
			var tmp = Bond.Users.filter($(this).val());
			
			var $out = $('<ul />').attr('id','results');

			$.each(tmp, function(i,user) {
				var userId = user.userId;
				delete user.userId;

				var $resources = $('<div />').addClass('resources');

				$.each(user, function(resourceId, resourceStatus) {
					$resources.append(
						$('<div />')
							.addClass(resourceStatus)
							.html(resourceId.substring(0, resourceId.length - 8))  // remove shit from end
							.on('click', function() {
								$('#to').val(userId.replace(/^user-/,'') + '/' + resourceId);
								$('#results').fadeOut(200);
							})
					);
				});

				$out.append(
					$('<li />')
						.append(
							$('<div />')
								.addClass('username')
								.html( userId.replace(/^user\-/,'') )
						)
						.append($resources)
				);
			});

			$('#results').replaceWith($out);
		});

	Bond.Users = {};

	Bond.Users.update = function(userId, user) {
		console.log('[Bond.Users.update] ' + userId);
		var userCurrent = store.get('user-' + userId);
		store.set('user-' + userId, $.extend(userCurrent, user))
	};

	Bond.Users.byStatus = function(status) {
		var list = [];

		$.each(store.getAll(), function(userId, user) {
			var online = false;

			
			if (!userId.match('user-')) return;
			

			$.each(user, function(i, userStatus) {
				if (userStatus === status)
					list.push( $.extend(user,{ userId: userId }) );
			});

		});

		return(list);
	};


	Bond.Message = function(to,message) {
		var out = {
			to: to,
			message: message
		};

		console.log('[Bond.Message] ',out);
		Bond.sockjs.send( JSON.stringify(out) );
	};

	Bond.Users.filter = function(filter) {

		var list = [];

		$.each(store.getAll(), function(userId, user) {
			var online = false;

			
			if (!userId.match('user-')) return;
			
			if (userId.toLowerCase().match( filter.toLowerCase() )) {
				list.push( $.extend(user,{ userId: userId }) );
			}

		});

		return(list);
	};


	var log = function(msg) {
		$('#logger').prepend($('<li />').html(msg));
	};

	var message = {};

	message.init = function(msg) {
		$.each(msg.accounts, function(i,account) {
			
			$.map(account.users, function(user, userId) {
				Bond.Users.update(userId, user);
			});
		});
	};


	message.connected = function(msg) {};
	message.presence = function(msg) {
		var update = {};
		update[msg.resource] = msg.status;

		Bond.Users.update(msg.from, update);
		log(new Date().toString() + ': ' + msg.from + '/' + msg.resource + ' is now ' + msg.status + '.');
	};
	message.typing = function(msg) {
		log(new Date().toString() + ': ' + msg.from + ' is typing (' + msg.status + ')');
	};

	message.message = function(msg) {
		log(new Date().toString() + ': ' + msg.from + ' sent a message: "' + msg.message + '"');
	};




	Bond.sockjs = new SockJS('/bond', {}, { debug: true });
	//Bond.sockjs = new SockJS('/bond', {}, { debug: true, protocols_whitelist: ['xhr-streaming', 'xhr-polling'] });

	Bond.sockjs.onopen = function() {
		connected = true;
		store.clear(); // @todo - temporarily clear store
		console.log('Connection opened.');
	};

	Bond.sockjs.onmessage = function(m) {
		var msg = JSON.parse(m.data);
		
		// process message based on type
		message[msg.t] ? message[msg.t](msg.e) : console.log('Unable to handle message of type "' + msg.t + '"');
	};

	Bond.sockjs.onclose = function() {
		connected = false;
		console.log('Connection closed.',Bond.sockjs);
		setTimeout(function() { location.reload() }, 5000);
	};

});
