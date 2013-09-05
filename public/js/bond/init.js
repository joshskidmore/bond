
$(function() {
	if (!window.Bond) { 
		Bond = {
			UI: {},
			Util: {
				DOMSanitize: function(str) {
					return str.replace(/\@/g,'').replace(/\./g,'').replace(/\-/g,'')
				}
			}
		};
	}
});