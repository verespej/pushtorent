angular
	.module('register', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/register', {
				templateUrl: 'app/register/register.html',
				controller: 'Register',
				controllerAs: 'register'
			});
		}
	])
	.controller('RegisterCtrl', [
		function() {}
	]);