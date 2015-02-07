angular
	.module('login', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/login', {
				templateUrl: 'app/login/login.html',
				controller: 'Login',
				controllerAs: 'login'
			});
		}
	])
	.controller('LoginCtrl', [
		function() {}
	]);