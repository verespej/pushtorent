angular
	.module('backend', [])
	.factory('PropertyData', ['$http', function() {
		return {
			getAll: function() {
				var res = [];
				for (var i = 0; i < 10; i++) {
					res.push({
						id: i,
						name: 'NAME',
						desc: 'description',
						img: 'http://placehold.it/242x200',
						score: '100'
					});
				}
				return res;
			},

			getDetails: function() {

			}
		}
	}])
	.factory('ApplicationData', [function() {
		return {
			getAll: function() {
				var res = [];
				for (var i = 0; i < 10; i++) {
					res.push({
						id: i,
						property: {
							id: i,
							name: 'NAME',
							desc: 'description',
							img: 'http://placehold.it/242x200',
							score: '100'
						},
						status: 'underReview'
					});
				}
				return res;
			}
		}
	}])
	.factory('PropertyDetailsData', [function() {
		return {
			get: function(id){
				return {
					id: id,
					name: 'NAME',
					desc: 'description',
					costToWork: 'costToWork',
					healthCareServices: ['hc1','hc2'],
					shopping: ['store1', 'store2'],
					schools: ['school1', 'school2'],
					crime: [{
						'robbery': 'rate'
					}, 
					{
						'breakins': 'rate'
					}]
				}
			}
		}
	}]);