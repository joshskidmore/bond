$(function() {
	$('#nav-toggle').click(function(e) {
		e.preventDefault();
		$('body').toggleClass('side-menu-expanded');
	});
});