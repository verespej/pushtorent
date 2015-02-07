angular
	.module('register', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/register', {
				templateUrl: 'app/register/register.html',
				controller: 'RegisterCtrl',
				controllerAs: 'register'
			});
		}
	])
	.controller('RegisterCtrl', [
		function() {}
	]);