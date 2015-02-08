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
			$scope.submit = function() {
				registerUser.put({
					phone: $scope.phone,
					email: $scope.email,
					password: $scope.password,
					ssn: $scope.ssn,
					income: $scope.income,
					fname: $scope.fname,
					lname: $scope.lname,
					dob: $scope.dob,
					address: $scope.address,
					zip: $scope.zip
				});
			}
		}
	]);