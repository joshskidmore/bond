angular.module('bond', [])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', { templateUrl: 'partials/chat.html', controller: ChatCtrl })
			.otherwise({redirectTo: '/'});
	});