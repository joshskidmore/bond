module.exports = function(grunt) {

	grunt.initConfig({
		jade: {
			compile: {
				options: {
					data: {
						debug: true
					}
				},
				files: [
					{
						'app/index.html': 'src/index.jade'
					},
					{
						expand: true,
						cwd: 'src/partials',
						dest: 'app/partials',
						src: '*.jade',
						ext: '.html'
					},
										{
						expand: true,
						cwd: 'src/partials/settings',
						dest: 'app/partials/settings',
						src: '*.jade',
						ext: '.html'
					}
				]
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
					'app/css/bond.css': 'src/less/bond.less'
				}
			}
		},
		concat: {
			scripts: {
				options: {
					separator: ';'
				},
				src: [
					'src/vendor/jquery-2.0.3.js',
					'src/vendor/angular.js',
					'src/vendor/mousetrap.min.js',
					'src/js/controllers/*.js',
					'src/js/app.js',
					'src/js/services/*.js',
					'src/js/directives/*.js'
				],
				dest: 'app/js/bond.js'
			}
		},
		copy: {
			fonts: {
				files: [
					{
						'app/package.json': 'src/package.json'
					},
					{
						expand: true,
						src: ['src/vendor/bootstrap/fonts/*'],
						dest: 'app/fonts/',
						flatten: true
					}
				]
			},
			lib: {
				files: [
					{
						expand: true,
						cwd: 'src/lib/',
						src: ['**'],
						dest: 'app/lib/'
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