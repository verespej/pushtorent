var _ajax = function(url, type, data) {
	var settings = {
		url: url,
		type: type,
		dataType: "json"
	};

	if(data) {
		settings.data = JSON.stringfy(data);
	}

	return Q.Promise(function(resolve, reject) {
	    $.ajax(settings)
	    .then(function (data, textStatus, jqXHR) {
	        resolve(data);
	    }, function (jqXHR, textStatus, errorThrown) {
	        reject({
	        	statusCode: jqXHR.status,
	        	message: errorThrown.message,
	        	stackTrace: errorThrown.stack
	        });
	    });			
	});
};

var get = function(url) {
	return _ajax(url, "GET");
};

var put = function(url, data) {
	var defer = Q.defer();
	
	return defer.promise;
};