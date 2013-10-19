function ContactsCtrl($scope, contact) {
	$scope.roster = contact.roster;

	contact.on('roster-change', $scope.$apply.bind($scope));
	
	$scope.stateAndNameSortValue = function(contact) {
		var sortVal = '';
		switch (contact.state) {
			case 'online':
				sortVal += 'A';
				break;
			case 'away':
				sortVal += 'B';
				break;
			case 'dnd':
				sortVal += 'C';
				break;
			case 'offline':
				sortVal += 'D';
				break;
			default:
				// shouldn't really ever get here...
				sortVal += 'E';
				break;
		}

		sortVal += contact.name;

		return sortVal;
	};
}