function SettingsCtrl($scope, accountSettings) {

	//
	// settings navigation
	// 

	var settingsScreens = {
		'home': 'partials/settings/settings-home.html',
		'choose-provider': 'partials/settings/choose-provider.html',
		'edit-account': 'partials/settings/account.html',
		'confirm-delete-account': 'partials/settings/confirm-delete-account.html'
	};

	$scope.goToScreen = function(screen) {
		// hacky check to see if we're moving away from an account screen and need
		// to clear some state.
		if(!/account/.test(screen)) {
			$scope.currentAccount = $scope.currentProvider = null;
		}
		$scope.currentSettingsScreen = settingsScreens[screen];
	};

	$scope.goToScreen('home');


	//
	// account management
	// 

	$scope.accounts = accountSettings.accounts;
	$scope.providers = accountSettings.providers;
	$scope.currentAccount = null;
	$scope.currentProvider = null;

	$scope.editAccount = function(acct) {
		$scope.currentAccount = acct;
		$scope.currentProvider = accountSettings.getProvider(acct.providerId);
		$scope.goToScreen('edit-account');
	};

	$scope.newAccount = function(provider) {
		$scope.currentProvider = provider;
		$scope.goToScreen('edit-account');
	};
}