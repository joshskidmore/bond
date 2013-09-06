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
					'public/chat.html': 'public/src/views/chat.jade'
				}
			}
		},
		less: {
			compile: {
				options: {
					compress: true,
					data: {
						debug: true
					}
				},
				files: {
					'public/css/bond.css': 'public/src/less/bond.less'
				}
			}
		},
		concat: {
			scripts: {
				options: {
					separator: ';'
				},
				src: [
					'public/src/js/third-party/jquery-2.0.3.js',
					'public/src/js/third-party/mousetrap.min.js',
					'public/src/js/side-menu.js'
				],
				dest: 'public/js/bond.js'
			}
		},
		copy: {
			fonts: {
				files: [
					{
						expand: true,
						src: ['public/src/bootstrap/fonts/*'],
						dest: 'public/fonts/',
						flatten: true
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['jade', 'less', 'concat', 'copy']);
	
};