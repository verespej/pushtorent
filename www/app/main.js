angular
	.module('pushtorent', ['ngRoute', 'login', 'register'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.otherwise({
				redirectTo: '/login'
			});
		}
	]);