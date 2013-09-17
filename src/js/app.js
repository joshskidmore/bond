var bond = angular.module('bond', [])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', { templateUrl: 'partials/chat.html', controller: ChatCtrl })
			.when('/settings', { templateUrl: 'partials/settings.html', controller: SettingsCtrl })
			.when('/accounts/:providerId/:index', { templateUrl: 'partials/account.html', controller: AccountCtrl })
			.otherwise({ redirectTo: '/' });
	});
