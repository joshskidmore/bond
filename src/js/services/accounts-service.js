function AccountService(accountSettings) {

	// accountSettings.accounts.filter(function(account) {
	// 	return account.connectOnStartup;
	// }).forEach(function(account) {
	// 	var client = bondCore.accounts.connect(account);
	// 	console.log(client);
	// 	window.client = client;
	// });

}

bond.service('accounts', AccountService);
