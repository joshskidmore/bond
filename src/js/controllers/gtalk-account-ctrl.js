function GTalkAccountCtrl($scope, $routeParams, account) {
	var index = +$routeParams.index;

	if (index === -1) {
		$scope.isNewAccount = true;
		$scope.account = account.getBlankGTalkAccount();
	} else {
		$scope.isNewAccount = false;
		$scope.account = account.accounts[index];
	}
}