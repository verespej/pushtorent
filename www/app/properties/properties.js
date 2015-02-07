angular
	.module('properties', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/properties', {
				templateUrl: 'app/properties/properties.html',
				controller: 'PropertiesCtrl',
				controllerAs: 'properties'
			});
		}
	]);