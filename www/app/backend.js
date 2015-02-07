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
	}]);