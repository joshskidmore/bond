function ContactsCtrl($scope, contact) {
	$scope.contacts = contact.getOnlineContacts();
}