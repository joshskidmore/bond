function ContactsCtrl($scope, accounts, contact) {
	$scope.accounts = accounts.accounts;
	$scope.contacts = contact.getOnlineContacts();
	// $scope.contacts = contact.getOnlineContacts();
}