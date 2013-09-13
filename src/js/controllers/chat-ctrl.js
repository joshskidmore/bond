function ChatCtrl($scope, $rootScope) {
	$scope.toggleSideMenu = function() {
		$rootScope.sideMenuExpanded = !$rootScope.sideMenuExpanded;
	};

	Mousetrap.bind('ctrl+p', function() {
		$scope.toggleSideMenu();
		$rootScope.$apply();
	});

	$scope.$on('$destroy', function() {
		Mousetrap.unbind('ctrl+p');
		$rootScope.sideMenuExpanded = false;
	});
}