angular
	.module('properties', ['ngRoute', 'backend'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/properties', {
				templateUrl: 'app/properties/properties.html',
				controller: 'PropertiesCtrl',
				controllerAs: 'properties',
				resolve: {
					PropertyList: ['PropertyData',
						function(propertyData) {
							return propertyData.getAll();
						}
					]
				}
			});
		}
	])
	.controller('PropertiesCtrl', ['PropertyList',
		function(list) {
			this.list = list;
		}
	]);