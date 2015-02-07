angular
	.module('home', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/home', {
				templateUrl: 'app/home/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'home'
			});
		}
	])
	.controller('HomeCtrl', [
		function() {}
	]);