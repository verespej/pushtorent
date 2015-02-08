angular
	.module('property-details', ['ngRoute', 'backend'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/property-details', {
				templateUrl: 'app/properties/property-details.html',
				controller: 'PropertyDetailsCtrl',
				controllerAs: 'propertyDetails'
			});
		}
	])
	.controller('PropertyDetailsCtrl', ['PropertyData', '$routeParams',
		function(propertyData, routeParams) {
			var self = this;
			propertyData.getDetails(routeParams.id).then(function(data) {
				self.data = data;
			});
		}
	]);