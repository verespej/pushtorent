module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			dev: {
				files: {
					'bin-site/main.css': 'www/app/main.less'
				}
			}
		},
		processhtml: {
			dev: {
				options: {
					strip: true,
					data: {
						scripts: grunt.file.expand({
							cwd: 'www'
						}, 'app/**/*.js'),
					}
				},
				files: {
					'bin-site/index.html': 'www/index.html'
				}
			}
		},
		connect: {
			dev: {
				options: {
					hostname: '*',
					port: 9000,
					base: ['bower_components', 'bin-site', 'www'],
					livereload: true,
					useAvailablePort: true,
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
			less: {
				files: ['www/**/*.less'],
				tasks: ['concat:less', 'less:dev', 'autoprefixer']
			},
			html: {
				files: ['www/index.html'],
				tasks: ['processhtml:dev']
			},
			others: {
				files: ['www/app/**/*.html', 'www/app/**/*.js'],
				tasks: []
			}
		},

		clean: ['bin-site']
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('dev', ['less', 'processhtml:dev', 'connect', 'watch']);
	grunt.registerTask('default', ['dev']);
};