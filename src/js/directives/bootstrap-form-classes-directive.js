bond.directive('bootstrapFormClasses', function factory() {
	return {
		restrict: 'A',
		replace: false,
		link: function(scope, iElement) {
			$(iElement).on('change keydown blur', 'input', function(e) {
				var $input = $(this),
					isFocused = $input.is(':focus'),
					isValid = $input.data().$ngModelController.$valid,
					$formGroup = $input.closest('.form-group');

				if (isFocused || isValid) {
					// hide error message if we're valid OR if the user is still working on the field
					$formGroup.removeClass('has-error');
				} else {
					$formGroup.addClass('has-error');
				}
			});
		}
	};
});