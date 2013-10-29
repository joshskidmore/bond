function MainCtrl($scope) {
	var nwWindow = require('nw.gui').Window.get();

	$scope.contactsBarExpanded = true;
	$scope.settingsBarExpanded = false;

	$scope.toggleContacts = function() {
		$scope.contactsBarExpanded = !$scope.contactsBarExpanded;
	};

	$scope.toggleSettings = function() {
		$scope.settingsBarExpanded = !$scope.settingsBarExpanded;
	};

	Mousetrap.bind('f12', function() {
		nwWindow.showDevTools();
	});

	Mousetrap.bind('ctrl+p', function() {
		$scope.toggleContacts();
		$scope.$apply();
	});

	Mousetrap.bind('ctrl+space', function() {
		$scope.toggleSettings();
		$scope.$apply();
	});
}