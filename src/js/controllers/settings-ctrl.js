function SettingsCtrl($scope, account) {

	//
	// settings navigation
	// 

	var settingsScreens = {
		'home': 'partials/settings/settings-home.html',
		'choose-provider': 'partials/settings/choose-provider.html',
		'edit-account': 'partials/settings/account.html'
	};

	$scope.goToScreen = function(screen) {
		if(screen !== 'edit-account') {
			// clear some state
			$scope.currentAccount = $scope.currentProvider = null;
		}
		$scope.currentSettingsScreen = settingsScreens[screen];
	};

	$scope.goToScreen('home');


	//
	// account management
	// 

	$scope.accounts = account.accounts;
	$scope.providers = account.providers;
	$scope.currentAccount = null;
	$scope.currentProvider = null;

	$scope.editAccount = function(acct) {
		$scope.currentAccount = acct;
		$scope.currentProvider = account.getProvider(acct.service);
		$scope.goToScreen('edit-account');
	};

	$scope.newAccount = function(provider) {
		$scope.currentProvider = provider;
		$scope.goToScreen('edit-account');
	};
}