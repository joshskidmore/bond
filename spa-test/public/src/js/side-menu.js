$(function() {
	var toggleSideMenu = function(e) {
		e.preventDefault();
		$('body').toggleClass('side-menu-expanded');
	};

	$('#nav-toggle').click(toggleSideMenu);
	Mousetrap.bind('ctrl+p', toggleSideMenu);
	
});