var bondCore = require('./lib');

function AccountService(accountSettings) {
	console.log(accountSettings);
	// bondCore._accounts = JSON.parse( bondCore.userData.readFileSync('accounts.json') );
	// theClient = bondCore.accounts.connect(bondCore._accounts[0]);
}

bond.service('accounts', AccountService);
