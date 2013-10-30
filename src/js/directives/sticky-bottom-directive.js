bond.directive('stickyBottom', function factory() {
	return {
		restrict: 'A',
		link: function(scope, el) {
			var stickToBottom = true;

			// test function to see if we're currently 'stuck' to the bottom
			var test = function() {
				// count anything within 15 pixels of the bottom
				stickToBottom = el.prop('scrollHeight') - el.height() - el.prop('scrollTop') < 15;
			};

			var scrollToBottom = function() {
				el.prop('scrollTop', 9999999999);
			};

			// run test whenever we scroll
			el.on('scroll', test);
			// ... and right now
			test();

			// apply sticky behavior when the window is resized
			$(window).on('resize', function() {
				if (stickToBottom) scrollToBottom();
			});

			scope.$watch(function() {
				return el.children().length;
			}, function() {
				if (stickToBottom) scrollToBottom();
			});
		}
	};
});
