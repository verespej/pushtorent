angular
	.module('applications', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/applications', {
				templateUrl: 'app/applications/applications.html',
				controller: 'ApplicationCtrl',
				controllerAs: 'applications',
				resolve: {
					ApplicationList: ['ApplicationData',
						function(applicationData) {
							return applicationData.getAll();
						}
					]
				}
			});
		}
	])
	.controller('ApplicationCtrl', ['ApplicationList',
		function(list) {
			this.list = list;
		}
	]);