function SettingsCtrl($scope, account) {
	$scope.accounts = account.accounts;
	$scope.providers = account.providers;
}