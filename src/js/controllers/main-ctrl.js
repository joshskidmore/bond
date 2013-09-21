function MainCtrl($scope) {
	var nwWindow = require('nw.gui').Window.get();

	$scope.toggleContacts = function() {
		$scope.contactsBarExpanded = !$scope.contactsBarExpanded;
	};

	Mousetrap.bind('f12', function() {
		nwWindow.showDevTools();
	});

	Mousetrap.bind('ctrl+p', function() {
		$scope.toggleContacts();
		$scope.$apply();
	});
}