angular
	.module('login', ['ngRoute', 'backend'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/login', {
				templateUrl: 'app/login/login.html',
				controller: 'LoginCtrl',
				controllerAs: 'login'
			});
		}
	])
	.controller('LoginCtrl', ['$scope', 'LoginUser', '$location',
		function($scope, loginUser, $location) {
			$scope.signin = function() {
				loginUser.put({
					phone: $scope.phone,
					password: $scope.password
				});
				$location.path('/home');
			}
		}
	]);