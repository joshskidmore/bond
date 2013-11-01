function ConversationCtrl($scope, $timeout) {
	$scope.messageText = '';

	$scope.sendMessage = function($event) {
		// we only care about <enter>
		if ($event.which !== 13) return;
		// don't send on <shift> + <enter>
		if ($event.shiftKey) return;
		// don't send empty messages
		if (!$scope.messageText.length) return;

		$timeout(function() {
			$scope.conversation.sendMessage($scope.messageText);
			$scope.messageText = '';
		});
	};
}
