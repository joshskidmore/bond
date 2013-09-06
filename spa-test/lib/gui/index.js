
var bond = require('../');

exports.init = function() {
	var gui = bond.nwGui,
		bondWin = gui.Window.get();

	// devtools on f12
	window.addEventListener('keydown', function (ev) {
		if (ev.keyIdentifier === 'F12')
			bondWin.showDevTools();
	});


	// tray
	// var menu = new gui.Menu(),
	// 	tray = new gui.Tray({ icon: 'public/img/test-smaller.png' }),
	// 	menuItemShowBond = new gui.MenuItem({ type: 'normal', label: 'Bond' }),
	// 	menuItemPreferences = new gui.MenuItem({ type: 'normal', label: 'Preferences' }),
	// 	menuItemQuit = new gui.MenuItem({ type: 'normal', label: 'Quit' });
	
	// menuItemShowBond.on('click', function() { bondWin.show(); });
	// menuItemQuit.on('click', function() { gui.App.quit(); });

	// menu.append(menuItemShowBond);
	// menu.append(menuItemPreferences);
	// menu.append(menuItemQuit);
	// tray.menu = menu;


	// window notification
	//bondWin.requestAttention(true);
};