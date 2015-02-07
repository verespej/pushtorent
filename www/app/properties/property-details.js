angular
	.module('property-details', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/property-details', {
				templateUrl: 'app/properties/property-details.html',
				controller: 'PropertyDetailsCtrl',
				controllerAs: 'propertyDetails'
			});
		}
	])
	.controller('PropertyDetailsCtrl', [
		function() {}
	]);