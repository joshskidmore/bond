function MainCtrl($scope) {
	var nwWindow = require('nw.gui').Window.get();

	Mousetrap.bind('f12', function() {
		nwWindow.showDevTools();
	});

	$scope.$on('$destroy', function() {
		Mousetrap.unbind('f12');
	});
}