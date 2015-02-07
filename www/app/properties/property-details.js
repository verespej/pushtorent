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
	.controller('PropertyDetailsCtrl', ['PropertyDetailsData', '$routeParams',
		function(detailsData, routeParams) {
			console.log(routeParams.id);
			this.data = detailsData.get(routeParams.id);
		}
	]);