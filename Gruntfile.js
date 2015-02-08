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
			dist: {
				cwd: 'www',
				src: 'app/**/*.html',
				dest: 'bin-site/tempCache.js.tmp'
			},
			options: {
				module: 'pushtorent'
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			dist: {
				files: {
					'bin-site/main.min.js': ['www/app/**/*.js', 'bin-site/tempCache.js.tmp']
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
			proxies: [{
				changeOrigin: false,
				host: 'localhost',
				port: '5000',
				context: '/server',
				rewrite: {
					'server': 'server'
				}
			}],
			dev: {
				options: {
					hostname: '*',
					port: 9000,
					base: ['test/res', 'bower_components', 'bin-site', 'www'],
					livereload: true,
					middleware: function(connect, options) {
						var middlewares = [];
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}
						middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
						options.base.forEach(function(base) {
							middlewares.push(connect.static(base));
						});
						return middlewares;
					},
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

	grunt.registerTask('dev', ['clean:init', 'less', 'processhtml:dev', 'configureProxies:server', 'connect:dev', 'watch']);
	grunt.registerTask('default', ['dev']);
};