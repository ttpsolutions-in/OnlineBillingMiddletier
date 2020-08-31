//Service to call Local Rest API
ETradersApp.factory('CommonService', ['$http', '$alert', 'serviceBaseURL', 'ExceptionHandler', function ($http, $alert, serviceBaseURL, ExceptionHandler) {

    var CommonService = {};


    CommonService.GetListItems = function (list) {
        var url;
        url = serviceBaseURL + "/odata/" + list.title + "?$select=" + list.fields.toString();

        if (list.hasOwnProperty('lookupFields') && list.lookupFields.toString().length > 0) {
            url += "&$expand=" + list.lookupFields.toString();
        }
        if (list.hasOwnProperty('filter') && list.filter && list.filter.toString().length > 0) {
            url += "&$filter=" + list.filter;
        }
        if (list.hasOwnProperty('limitTo') && list.limitTo > 0) {
            url += "&$top=" + list.limitTo.toString();
        }
        if (list.hasOwnProperty('orderBy') && list.orderBy) {
            url += "&$orderby=" + list.orderBy.toString();
        }
        console.log("GetListItems URL: " + url);

        var req = {
            method: 'GET',
            cache: false,
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        }
        //Return Json File Response
        var promise = $http(req).then(function (response) {
            return response;
        }, function (response) {
            //Exception Handling
            console.log("error=" + JSON.stringify(response));
            return response;
        });

        return promise;
    }

    //Save data 
    CommonService.PostData = function (model, data) {
        //Prepare request object
        var req = {
            method: 'POST',
            cache: false,
            url: serviceBaseURL + '/odata/' + model,
            headers: {
                'Content-Type': 'application/json; odata=verbose'
            },
            data: data
        };
        //Call WCF Service
        var promise = $http(req).then(function (response) {
            return response.data;
        }, function (error) {
                console.log(error)
                //Exception Handling
                ExceptionHandler.HandleException(error);
        });
        return promise;
    };
    //Delete Data
    CommonService.DeleteData = function (model, id) {
        //Prepare request object
        var req = {
            method: 'DELETE',
            cache: false,
            url: serviceBaseURL + '/odata/' + model + '/(' + id + ')',
            headers: {
                'Content-Type': 'application/json; odata=verbose'
            },

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
    //Update Data
    CommonService.UpdateData = function (model, data, id) {
        //Prepare request object
        var req = {
            method: 'PATCH',
            cache: false,
            url: serviceBaseURL + '/odata/' + model + '/(' + id + ')',
            headers: {
                'Content-Type': 'application/json; odata=verbose'
            },
            data: data
        };
        //Call WCF Service
        var promise = $http(req).then(function (response) {
            return response.data;
        }, function (response) {
            //Exception Handling
                console.log(response);
            ExceptionHandler.HandleException(response);
        });
        return promise;
    };

    CommonService.CalculateGSTNGrandTotal = function (BaseData) {
        var calculatedData = {};
        calculatedData.GrandTotal = 0;
        calculatedData.GSTAmount = 0;
        calculatedData.GrandTotal = BaseData.TotalAmount;
        var isChecked = BaseData.GSTApplied;
        if (isChecked) {
            calculatedData.GSTAmount = (parseFloat(BaseData.TotalAmount) * (parseFloat(BaseData.GSTPercentage) / 100)).toFixed(2);
            calculatedData.GrandTotal = (parseFloat(BaseData.TotalAmount) + parseFloat(calculatedData.GSTAmount)).toFixed(2);
        } else {
            calculatedData.GrandTotal = parseFloat(calculatedData.GrandTotal).toFixed(2);
            calculatedData.GSTAmount = 0;
        }
        return calculatedData;
    };

    CommonService.GetGodowns = function () {
        var GodownData = {};
        var lstItems = {
            title: "Godowns",
            fields: ["GodownId", "GodownName"],
            filter: ["Active eq 1"],
            orderBy: "GodownName"
        };
        //$scope.showSpinner();
        CommonService.GetListItems(lstItems).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                GodownData = response.data.d.results;
            }
            return GodownData;
        });
    };

    CommonService.CalculateRowTotalAmount = function (rate,quantity,discount,DLP) {

        var result = {};
        result.IsDiscountApplied = 0;
        result.Amount = 0;

        var amount = parseFloat(rate) * parseFloat(quantity);
        var totalAmount = 0;
        if (discount > 0) {
            totalAmount = (amount - (amount / 100) * parseFloat(discount)).toFixed(2);
            result.IsDiscountApplied = 1;
        } else {
            totalAmount = amount;
        }
        result.Amount = parseFloat(totalAmount).toFixed(2) - parseFloat(DLP.toFixed(2));
        return result;
    }
    return CommonService;
}]);

