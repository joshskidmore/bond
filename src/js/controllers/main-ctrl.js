function MainCtrl($scope) {
	var nwWindow = require('nw.gui').Window.get();

	$scope.toggleSideMenu = function() {
		$scope.sideMenuExpanded = !$scope.sideMenuExpanded;
	};

	Mousetrap.bind('f12', function() {
		nwWindow.showDevTools();
	});

	Mousetrap.bind('ctrl+p', function() {
		$scope.toggleSideMenu();
		$scope.$apply();
	});
}