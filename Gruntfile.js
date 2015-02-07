module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			dev: {
				files: {
					'bin-site/main.css': 'www/app/main.less'
				}
			}
		},

		ngtemplates: {
			tempCache: {
				cwd: 'www',
				src: 'app/**/*.html',
				dest: 'bin-site/tempCache.js.tmp'
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			dist: {
				files: {
					'bin-site/main.min.js': ['bin-site/tempCache.js.tmp', 'www/app/**/*.js']
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
			},
			dist: {
				options: {
					data: {
						scripts: ['main.min.js']
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
				tasks: ['less:dev']
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

		clean: {
			init: ['bin-site'],
			dist: ['bin-site/**/*.tmp']
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('dist', ['clean:init', 'less', 'ngtemplates', 'uglify', 'processhtml:dist', 'clean:dist']);

	grunt.registerTask('dev', ['clean:init', 'less', 'processhtml:dev', 'connect', 'watch']);
	grunt.registerTask('default', ['dev']);
};