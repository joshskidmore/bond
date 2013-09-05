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
		},
		less: {
			compile: {
				options: {
					data: {
						debug: true
					}
				},
				files: {
					'bond.css': 'less/bond.less'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', ['jade','less']);
	
};