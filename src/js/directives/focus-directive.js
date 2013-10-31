// yanked from http://stackoverflow.com/questions/14859266/input-autofocus-attribute
bond.directive('fauxcus', function factory($timeout) {
	return {
		restrict: 'A',
		link: function(scope, el, attrs) {
			scope.$watch( attrs.fauxcus, function(val) {
				if (angular.isDefined(val) && val) {
					$timeout(function() { el[0].focus(); });
				}
			}, true);
		}
	};
});
