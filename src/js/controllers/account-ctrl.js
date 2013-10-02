function AccountCtrl($scope, accountSettings) {
	// grab convenience account and provider references from parent $scope
	$scope.provider = $scope.currentProvider;
	$scope.options = $scope.provider.getOptionsAsList();
	$scope.isNewAccount = !$scope.currentAccount;
	$scope.account = $scope.currentAccount || {};

	$scope.saveAccount = function() {
		if ($scope.isNewAccount) {
			$scope.account.providerId = $scope.provider.id;
		 	accountSettings.accounts.push($scope.account);
		 }

		accountSettings.saveAccounts();
		$scope.goToScreen('home');
	}

	$scope.deleteAccount = function(confirmed) {
		if (!confirmed) {
			$scope.goToScreen('confirm-delete-account');
		} else {
			var index = $scope.accounts.indexOf($scope.account);
			$scope.accounts.splice(index, 1);
			accountSettings.saveAccounts();
			$scope.goToScreen('home');
		}
	};
}
