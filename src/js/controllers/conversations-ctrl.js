function ConversationsCtrl($scope, conversations) {
	$scope.conversations = conversations.conversations;

	$scope.activeConversation = null;

	$scope.setActiveConversation = function(conversation) {
		if (conversation === $scope.activeConversation) return;

		$scope.activeConversation && ($scope.activeConversation.isActive = false);

		conversation.isActive = true;

		$scope.activeConversation = conversation;
	};

	conversations.on('chat', $scope.$apply.bind($scope));

	conversations.on('conversation', function(conversation) {
		// if this is the first conversation, default it as active
		if ($scope.conversations.length === 1) {
			$scope.setActiveConversation(conversation);
		}

		$scope.$apply();
	});
}
