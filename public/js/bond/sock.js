
$(function() {
	var connected = false,
		i = 0;


	Bond.UI.Chat = function(chat) {
		if (!chat.viewId || !chat.type || !chat.message)  return;

		var $view = $('#view-' + chat.viewId),
			$chat = $('.chat',$view);


		$chat.append(
			$('<li />')
				.addClass('chat-item chat-dir-' + chat.type)
				.append(
					$('<span />')
						.addClass('time')
						.html('[' + moment().format('HH:MM:SS') + '] ')
				)
				.append(
					$('<span />')
						.addClass('direction')
						.html(chat.type === 'out' ? ' --> ' : ' <-- ')
				)
				.append(
					$('<span />')
						.addClass('message')
						.html(chat.message)
				)
		);

	};




	Bond.UI.View = {};

	Bond.UI.View.Create = function(view) {
		if ( $('#view-' + view.viewId).length) {
			console.log('view already exists');
			return;
		}

		var _template = '<div id="view-{{viewId}}" class="view"><h2>{{label}}</h2>{{details}}<ul class="chat" /><div class="chat-toolbar"><input class="chat-input" type="text" /><button class="chat-btn" {{btnData}}>Chat</button></div></div>',
			$view = $(Handlebars.compile(_template)(view)),
			$btn = $('.chat-btn', $view),
			$messageBox = $('.chat-input', $view);

		var sendMessage = function() {
			var data = $btn.data(),
				message = $messageBox.val();


			if (!message || !data.userId || !data.accountId) {
				console.log('Unable to send message due to missing data');
				return;
			}

			Bond.Message({
				accountId: data.accountId,
				userId: data.userId,
				message: message
			});

			$messageBox.val('');
		};


		$messageBox
			.on('keyup', function(ev) {
				//@todo
				if (ev.keyCode === 13)
					sendMessage();
			});

		$btn.on('click', sendMessage);

		$view.appendTo('#views');

		Bond.UI.Tab.Create({ viewId: view.viewId, label: view.label });

		return $view;
	};


	Bond.UI.View.Activate = function(view) {
		if (!view.viewId) return;

		Bond.Log('[Bond.UI.View.Activate] ' + activeView + ' --> ' + view.viewId);

		if (view.viewId === activeView) {
			console.log('Current view is activeView - ignoring');
			return;
		}

		if (activeView) {
			$('#tab-' + activeView).removeClass('active');
			$('#view-' + activeView).hide();
		}

		var $view = $('#view-' + view.viewId);

		$view
			.fadeIn(200, function() {
				$('#tab-' + view.viewId)
					.addClass('active')
					.removeClass('notify');

				activeView = view.viewId;
				$('.chat-input',$view).focus();
			});
	};




	Bond.UI.Tab = {};

	Bond.UI.Tab.Notify = function(tab) {
		if (!tab.viewId)  return;

		tab.class = tab.class ? tab.class : 'notify';

		var $tab = $('#tab-' + tab.viewId);

		$tab
			.removeClass()
			.addClass('tab.item ' + tab.class);

		if (tab.duration)
			setTimeout(function(){ $tab.removeClass(tab.class); }, tab.duration*1000);
	};


	Bond.UI.Tab.Create = function(tab) {
		if ( $('#tab-' + tab.viewId).length) {
			console.log('tab already exists');
			return;
		}

		//tab.viewId = tab.viewId ? tab.viewId : tab.accountId + '---' + tab.userId;
		var _template = '<li class="tab-item" id="tab-{{viewId}}" data-view-id="{{viewId}}">{{label}}</li>',
			$tab = $(Handlebars.compile(_template)(tab));

		$tab.on('click', function() { Bond.UI.View.Activate({viewId: tab.viewId}); });

		$tab.appendTo('#tabs');

		return $tab;
	};
	



	Bond.Users = {};

	Bond.Users.update = function(accountId, userId, user) {
		var userCurrent = store.get('user-' + userId);
		store.set('user-' + accountId + '--' + userId, $.extend(userCurrent, user))
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

	Bond.Users.filter = function(filter) {

		var list = [];

		$.each(store.getAll(), function(_userId, user) {
			if (!_userId.match(/^user-/)) return;

			var _user = _userId.split('--'),
				accountId = _user[0],
				userId = _user[1];


			if (userId.toLowerCase().match( filter.toLowerCase() )) {
				list.push( $.extend(user,{ userId: userId }) );
			}

		});

		return(list);
	};






	Bond.Message = function(msg) {
		if (typeof msg !== 'object') return;

		msg.type = 'message';

		Bond.Log('[Bond.Message] ' + JSON.stringify(msg));
		Bond.sockjs.send( JSON.stringify(msg) );
	};

	Bond.Log = function(msg) {

		$('#logger')
			.prepend(
				$('<li />')
					.addClass('log-item')
					.append(
						$('<div />')
							.addClass('time')
							.html('[' + moment().format('hh:mm:ss') + ']  ')
					)
					.append(
						$('<div />')
							.addClass('log')
							.html(msg)
					)
			);
	};



















	activeView = null;

	var showView = function(accountId, userId) {

		var accountIdSan = accountId.replace(/\@/g,'').replace(/\./g,'').replace(/\-/g,''),
			userIdSan = userId.replace(/\@/g,'').replace(/\./g,'').replace(/\-/g,''),
			viewId = 'view-' + accountIdSan + '--' + userIdSan;

		Bond.Log('showView: ' +  viewId);
		
		// hide all views
		activeView && $('#' + activeView).hide();

		// show requested view
		$('#' + viewId).fadeIn(200, function() { activeView = viewId; });
	};



	$('body')
		.on('keyup', function(ev) {

			if (ev.ctrlKey && ev.keyCode === 80) {
				$('#filter')
					.fadeIn(200)
					.focus();
			}

			var total = $('#results li').length;

			if (!total)  return;

			// 40 = down
			// 38 = up
			// 13 = enter
			// 80 = "p"

			if (ev.keyCode === 40) {
				i++;
				i = i > total ? 1 : i;

				var $activeLi = $($('#results li')[i-1]);

				$('#results li')
					.removeClass('hover');
				
				$activeLi
					.addClass('hover')
					.focus();
				
			} else if (ev.keyCode === 38) {
				i--;
				i = i < 1 ? total: i;

				var $activeLi = $($('#results li')[i-1]);

				$('#results li')
					.removeClass('hover');
				
				$activeLi
					.addClass('hover')
					.focus();
			} else if (ev.keyCode === 13) {
				var $activeLi = $($('#results li')[i-1]),
					data = $activeLi.data(),
					//userId = $activeLi.data('userId'),
					//accountId = $activeLi.data('accountId'),
					viewId = Bond.Util.DOMSanitize(data.accountId) + '--' + Bond.Util.DOMSanitize(data.userId);
				
				Bond.UI.View.Create({ viewId: viewId, label: data.userId + ' (' + data.accountId + ')', btnData: 'data-user-id=' + data.userId + ' data-account-id=' + data.accountId });
				Bond.UI.View.Activate({ viewId: viewId });

				hideMenu();
			}

		});

	


	var $results = $('#results');

	var hideMenu = function(keepOpen) {
		$('#filter').val(''); 	// reset

		return $('#results').fadeOut(100, function() {
			!keepOpen && $('#filter').fadeOut(200);
		});
	}

	$('#filter')
		.on('keyup', function(ev) {
			if (ev.keyCode === 27)
				return hideMenu();
			else if ($(this).val().length === 0)
				return hideMenu(true);
			else if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13)
				return;

			var tmp = Bond.Users.filter($(this).val());
			
			var $out = $('<ul />').attr('id','results');

			i = 0; // reset


			$.each(tmp, function(i,user) {
				var userId = user.userId;

				delete user.userId;

				if (i >= 5) return;

				var $resources = $('<div />').addClass('resources');

				$.each(user, function(resourceId, resourceStatus) {
					$resources.append(
						$('<div />')
							.addClass(resourceStatus)
							//.html(resourceId.substring(0, resourceId.length - 8) + ' - ' + resourceStatus.toUpperCase())  // remove shit from end
							.html(resourceId + ' (' + resourceStatus + ')')
							.on('click', function() {
								$('#to').val(userId.replace(/^user-/,'') + '/' + resourceId);
								hideMenu();
							})
					);
				});

				$out.append(
					$('<li />')
						.data('userId',userId)
						.data('accountId',user.accountId)
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

	
	




	var message = {};

	message.init = function(msg) {
		$.each(msg.e.accounts, function(accountId,account) {
			$.each(account.users, function(userId, user) {
				user.accountId = accountId;
				Bond.Users.update(accountId, userId, user);
			});
		});
	};


	message.connected = function(msg) {};

	message.presence = function(msg) {
		var update = {};
		update[msg.e.resource] = msg.e.status;

		Bond.Users.update(msg.a, msg.e.from, update);

		Bond.Log(msg.e.from + '/' + msg.e.resource + ' is now ' + msg.e.status);
	};



	message.typing = function(msg) {

		Bond.Log(msg.e.from + ' is typing (' + msg.e.status + ')');

		var viewId = Bond.Util.DOMSanitize(msg.a) + '--' + Bond.Util.DOMSanitize(msg.e.from);

		
		Bond.UI.View.Create({
			viewId: viewId,
			label: msg.e.from + ' (' + msg.a + ')',
			btnData: 'data-user-id=' + msg.e.from + ' data-account-id=' + msg.a
		});

		if (msg.e.status === 'active') {
			Bond.UI.Tab.Notify({
				viewId: viewId,
				class: 'notify-typing',
				//duration: 3
			});
		} else {
			$('#tab-' + viewId).removeClass('notify-typing');
		}

	};


	message.message = function(msg) {
		if (msg.e.type === 'out') {
			var viewId = Bond.Util.DOMSanitize(msg.a) + '--' + Bond.Util.DOMSanitize(msg.e.to);

			Bond.UI.View.Create({ viewId: viewId, label: msg.e.to + ' (' + msg.a + ')', btnData: 'data-user-id=' + msg.e.to + ' data-account-id=' + msg.a});
			Bond.UI.Chat({ viewId: viewId, type: msg.e.type, message: msg.e.message });
			return;
		}

		var viewId = Bond.Util.DOMSanitize(msg.a) + '--' + Bond.Util.DOMSanitize(msg.e.from);


		// log for debugging
		Bond.Log(msg.e.from + ' sent a message: "' + msg.e.message + '"');

		// create ui view
		Bond.UI.View.Create({ viewId: viewId, label: msg.e.from + ' (' + msg.a + ')', btnData: 'data-user-id=' + msg.e.from + ' data-account-id=' + msg.a});
		
		// notify tab
		Bond.UI.Tab.Notify({ viewId: viewId, duration: 8 });

		// update chat
		Bond.UI.Chat({ viewId: viewId, type: msg.e.type, message: msg.e.message })
	};


	


	Bond.UI.Tab.Create({ label: 'Debugger', viewId: '--debugger' });







	Bond.sockjs = new SockJS('/bond', {}, { debug: true });
	//Bond.sockjs = new SockJS('/bond', {}, { debug: true, protocols_whitelist: ['xhr-streaming', 'xhr-polling'] });

	Bond.sockjs.onopen = function() {
		Bond.Log('SockJS connection opened');
		store.clear(); // @todo - temporarily clear store
	};

	Bond.sockjs.onmessage = function(m) {
		var msg = JSON.parse(m.data);
		
		// process message based on type
		message[msg.t] ? message[msg.t](msg) : console.log('Unable to handle message of type "' + msg.t + '"');
	};

	Bond.sockjs.onclose = function() {
		Bond.Log('SockJS connection closed');
		//setTimeout(function() { location.reload() }, 5000);
	};


	// show debugger to start
	Bond.UI.View.Activate({viewId:'--debugger'});
	
	Bond.Log('Use [CTRL] + [P] to find users!');

});
