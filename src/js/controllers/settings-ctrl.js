function SettingsCtrl($scope, account) {
	$scope.currentAccountScreen = 'partials/list-accounts.html';
	$scope.accounts = account.accounts;
	$scope.providers = account.providers;

	$scope.editAccount = function(account) {
		$scope.currentAccountScreen = 'partials/account.html';
	};
}