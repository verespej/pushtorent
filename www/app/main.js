angular
	.module('pushtorent', ['ngRoute', 'login', 'register', 'home', 'properties', 'property-details', 'applications'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.otherwise({
				redirectTo: '/home'
			});
		}
	]);