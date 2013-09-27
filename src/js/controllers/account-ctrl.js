function AccountCtrl($scope, account) {
	// grab convenience account and provider references from parent $scope
	$scope.provider = $scope.currentProvider;
	$scope.isNewAccount = !$scope.currentAccount;
	$scope.account = $scope.currentAccount || {};

	$scope.saveAccount = function() {
		if ($scope.isNewAccount) {
			$scope.account.service = $scope.provider.id;
		 	account.accounts.push($scope.account);
		 }

		account.saveAccounts();
		$scope.goToScreen('home');
	}

	$scope.deleteAccount = function(confirmed) {
		if (!confirmed) {
			$scope.goToScreen('confirm-delete-account');
		} else {
			var index = $scope.accounts.indexOf($scope.account);
			$scope.accounts.splice(index, 1);
			account.saveAccounts();
			$scope.goToScreen('home');
		}
	};
}
