ETradersApp.service('HeaderInterceptor', ['GlobalVariableService', '$location', function (GlobalVariableService, $location) {
    var service = this;

    service.request = function (config) {
        if (!$location.absUrl().contains('token')) {
            config.headers["Authorizaiton"] = 'Bear ' + GlobalVariableService.TokenInfo.accessToken;
        }
        //config.headers["Authorizaiton"] = 'Bear ' + GlobalVariableService.TokenInfo.accessToken;
        return config;
    };
    service.requestError= function (rejection) {
        console.log(rejection);
        // Contains the data about the error on the request and return the promise rejection.    
        return $q.reject(rejection);
    }
    service.response= function (result) {
        console.log('data for ' + result.data.name + ' received');
        //If some manipulation of result is required before assigning to scope.    
        result["testKey"] = 'testValue';
        console.log('request completed');
        return result;
    }
    service.responseError= function (response) {
        console.log('response error started...');
        //Check different response status and do the necessary actions 400, 401, 403,401, or 500 eror     
        return $q.reject(response);
    }
      
}]);