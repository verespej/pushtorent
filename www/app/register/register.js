angular
	.module('register', ['ngRoute', 'backend'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/register', {
				templateUrl: 'app/register/register.html',
				controller: 'RegisterCtrl',
				controllerAs: 'register'
			});
		}
	])
	.controller('RegisterCtrl', ['RegisterUser', '$scope',
		function(registerUser, $scope) {
			registerUser.register($scope);
		}
	]);