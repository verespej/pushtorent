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
	.controller('PropertyDetailsCtrl', ['PropertyData', '$routeParams', '$scope', '$location',
		function(propertyData, routeParams, $scope, $location) {
			var self = this;
			propertyData.getDetails(routeParams.id).then(function(data) {
				console.log(data);
				self.data = data;
			});

			this.doApply = function() {
				alert('You application has been sent to review. We will notify you as soon as a descision has been made');
				$location.path('/home');
			}
		}
	]);