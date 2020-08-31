//Service to call Local Rest API
ETradersApp.factory('EtradersService', ['$http', '$alert', 'serviceBaseURL', 'ExceptionHandler', function ($http, $alert, serviceBaseURL, ExceptionHandler) {

    var EtradersService = {};

    //Save data details
    EtradersService.PostData = function (model, data) {
        debugger;
        //Prepare request object
        var req = {
            method: 'POST',
            cache: false,
            url: serviceBaseURL + '/odata/' + model,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        //Call WCF Service
        var promise = $http(req).then(function (response) {
            return response.data;
        }, function (response) {
            //Exception Handling
            ExceptionHandler.HandleException(response);
        });
        return promise;
    };


    //Save bill details
    EtradersService.SaveBillDetails = function (bill) {
       
        //Prepare request object
        var req = {
            method: 'POST',
            cache: false,
            url: serviceBaseURL + '/odata/Bills', 
            headers: {
                'Content-Type': 'application/json'
            },
            data: bill
        };
        //Call WCF Service
        var promise = $http(req).then(function (response) {
            //Return WCF Service response
            return response.data;
        }, function (response) {
            //Exception Handling
            ExceptionHandler.HandleException(response);
        });
        return promise;
    };


    //Save sales details
    EtradersService.SaveSaleDetails = function (sale) {
        //Prepare request object
        var req = {
            method: 'POST',
            cache: false,
            url: serviceBaseURL + '/odata/Sales',
            headers: {
                'Content-Type': 'application/json'
            },
            data: sale
        };
        //Call WCF Service
        var promise = $http(req).then(function (response) {
            //Return WCF Service response
            return response.data;
        }, function (response) {
            //Exception Handling
            ExceptionHandler.HandleException(response);
        });
        return promise;
    };
    return EtradersService;
}]);

