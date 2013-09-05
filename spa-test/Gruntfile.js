module.exports = function(grunt) {

	grunt.initConfig({
		jade: {
			compile: {
				options: {
					data: {
						debug: true
					}
				},
				files: {
					'index.html': 'views/index.jade'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jade');

	grunt.registerTask('default', ['jade']);
	
};