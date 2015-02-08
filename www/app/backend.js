angular
	.module('backend', [])
	.factory('PropertyData', ['$http', function($http) {
		return {
			getAll: function() {
				return $http.get('/server/properties').then(function(res) {
					return res.data;
				});
			},

			getDetails: function(id) {
				return $http.get('/server/properties/' + id).then(function(res) {
					return res.data;
				});
			},
		}
	}])
	.factory('ApplicationData', ['$http', function($http) {
		return {
			getAll: function() {
				return $http.get('/server/applications').then(function(res) {
					return res.data;
				});
			}
		}
	}])
	.factory('RegisterUser', ['$http', function($http) {
		return {
			registerUser: function(data) {
				console.log(JSON.stringfy(data));
			}
		}
	}]);