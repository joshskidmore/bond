function AccountCtrl($scope, $routeParams, $location, account) {

	var provider = account.providers[$routeParams.providerId],
		index = +$routeParams.index;

	$scope.provider = provider;

	if (index === -1) {
		var newAccount = {
			service: $routeParams.providerId
		};

		provider.configurableOptions.forEach(function(option) {
			newAccount[option.key] = option.default
		});

		$scope.isNewAccount = true;
		$scope.account = newAccount;
	} else {
		$scope.isNewAccount = false;
		$scope.account = account.accounts[index];
	}

	$scope.saveAccount = function() {
		// @todo - missing validation and notification

		if ($scope.isNewAccount)
		 	account.accounts.push(newAccount);

		account.saveAccounts();
		$location.path('/settings');
	}

}