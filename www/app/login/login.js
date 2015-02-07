angular
	.module('login', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/login', {
				templateUrl: 'app/login/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'login'
			});
		}
	])
	.controller('LoginCtrl', [
		function() {}
	]);