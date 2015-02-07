angular
	.module('applications', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/applications', {
				templateUrl: 'app/applications/applications.html',
				controller: 'ApplicationCtrl',
				controllerAs: 'application'
			});
		}
	])
	.controller('ApplicationCtrl', [
		function() {}
	]);