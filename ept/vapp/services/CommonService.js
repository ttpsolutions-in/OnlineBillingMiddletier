//Service to call Local Rest API
ETradersApp.factory('CommonService', ['$window', 'GlobalVariableService', '$http', '$alert', 'Config', 'ExceptionHandler',
    function ($window, GlobalVariableService, $http, $alert, Config, ExceptionHandler) {

        var CommonService = {};

        CommonService.GetListItems = function (list) {

            var tokenInfo = GlobalVariableService.getTokenInfo();
            var AccessToken = tokenInfo.AccessToken;


            var url;
            url = Config.ServiceBaseURL + "/odata/" + list.title + "?$select=" + list.fields.toString();

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
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "Authorization": "Bearer " + AccessToken
                }
            }
            //Return Json File Response
            var promise = $http(req).then(function (response) {
                return response;
            }, function (response) {
                //Exception Handling
                console.log("error=" + JSON.stringify(response));
                if (response.status == 401) {
                    $window.location.href = Config.ServiceBaseURL + "/login.html";
                }
                return response;
            });

            return promise;
        }

        //Save data 
        CommonService.PostData = function (model, data) {
            var tokenInfo = GlobalVariableService.getTokenInfo();
            var AccessToken = tokenInfo.AccessToken;


            //Prepare request object
            var req = {
                method: 'POST',
                cache: false,
                url: Config.ServiceBaseURL + '/odata/' + model,
                headers: {
                    'Content-Type': 'application/json; odata=verbose',
                    'Authorization': 'Bearer ' + AccessToken
                },
                data: data
            };
            //Call WCF Service
            var promise = $http(req).then(function (response) {
                return response.data;
            }, function (error) {
                console.log(error)
                //Exception Handling
                if (response.status == 401) {
                    $window.location.href = Config.ServiceBaseURL + "/login.html";
                }
                ExceptionHandler.HandleException(error);
            });
            return promise;
        };
        //Delete Data
        CommonService.DeleteData = function (model, id) {
            var tokenInfo = GlobalVariableService.getTokenInfo();
            var AccessToken = tokenInfo.AccessToken;

            //Prepare request object
            var req = {
                method: 'DELETE',
                cache: false,
                url: Config.ServiceBaseURL + '/odata/' + model + '/(' + id + ')',
                headers: {
                    'Content-Type': 'application/json; odata=verbose',
                    'Authorization': 'Bearer ' + AccessToken
                },

            };
            //Call WCF Service
            var promise = $http(req).then(function (response) {
                return response.data;
            }, function (response) {
                if (response.status == 401) {
                    $window.location.href = Config.ServiceBaseURL + "/login.html";
                }
                //Exception Handling
                ExceptionHandler.HandleException(response);
            });
            return promise;
        };
        //Update Data
        CommonService.UpdateData = function (model, data, id) {
            var tokenInfo = GlobalVariableService.getTokenInfo();
            var AccessToken = tokenInfo.AccessToken;
            //Prepare request object
            var req = {
                method: 'PATCH',
                cache: false,
                url: Config.ServiceBaseURL + '/odata/' + model + '/(' + id + ')',
                headers: {
                    'Content-Type': 'application/json; odata=verbose',
                    'Authorization': 'Bearer ' + AccessToken
                },
                data: data
            };
            //Call WCF Service
            var promise = $http(req).then(function (response) {
                return response.data;
            }, function (response) {
                //Exception Handling
                console.log(response);
                if (response.status == 401) {
                    $window.location.href = Config.ServiceBaseURL + "/login.html";
                }
                ExceptionHandler.HandleException(response);
            });
            return promise;
        };

        CommonService.CalculateGSTNGrandTotal = function (TotalAmount, GSTPercentage, GSTApplied) {
            var calculatedData = {};
            calculatedData.GrandTotal = 0;
            calculatedData.GSTAmount = 0;
            calculatedData.GrandTotal = TotalAmount;
            var isChecked = GSTApplied;
            if (isChecked) {
                calculatedData.GSTAmount = (parseFloat(TotalAmount) * (parseFloat(GSTPercentage) / 100)).toFixed(2);
                calculatedData.GrandTotal = (parseFloat(TotalAmount) + parseFloat(calculatedData.GSTAmount)).toFixed(2);
            } else {
                calculatedData.GrandTotal = parseFloat(calculatedData.GrandTotal).toFixed(2);
                calculatedData.GSTAmount = 0;
            }
            return calculatedData;
        };

        CommonService.GetGodowns = function () {
            var GodownData = [];
            var lstItems = {
                title: "Godowns",
                fields: ["GodownId", "GodownName"],
                filter: ["Active eq 1"],
                orderBy: "GodownName"
            };
            //$scope.showSpinner();
            var promise = CommonService.GetListItems(lstItems).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    GodownData = response.data.d.results;
                }
                return GodownData;
            });
            return promise;
        };

        CommonService.getMaterials = function (callback) {
            var lstItems = {
                title: "Materials",
                fields: ["MaterialId", "DisplayName", "RetailRate", "WholeSaleRate", "ItemCategoryId", "ItemCategory/ItemCategoryId"],
                lookupFields: ["ItemCategory"],
                orderBy: "DisplayName desc"
            };
            CommonService.GetListItems(lstItems).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    GlobalVariableService.setMaterialList(response.data.d.results);
                    //return JSON.parse($window.sessionStorage["MaterialList"]);                
                }
                if (callback)
                    callback();
            });
            //return promise;
        }
        CommonService.fetchRoleRights = async function (RoleName, callback) {

            var lstRightsManagement = {
                title: "RoleRightsViews",
                fields: ["*"],
                //lookupFields: ["EmployeeRole", "Right"],
                filter: ["RoleName eq '" + RoleName + "'"],
                orderBy: "DisplayOrder"
            };
            //if (RoleName != "Admin")
            //    lstRightsManagement.filter = "RoleName eq '" + RoleName + "'";

            CommonService.GetListItems(lstRightsManagement).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    GlobalVariableService.setRoleRights(response.data.d.results);
                }
                else {
                    GlobalVariableService.setRoleRights();

                }
                if (callback)
                    callback();
            });
        }

        CommonService.CalculateRowTotalAmount = function (rate, quantity, discount, DLP) {

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
            if (DLP)
                result.Amount = (parseFloat(totalAmount) - parseFloat(DLP)).toFixed(2);
            else
                result.Amount = parseFloat(totalAmount).toFixed(2);

            return result;
        }
        CommonService.getCategory = function () {
            return Category = {
                Supplier: 1,
                Customer: 2
            };
        }
        CommonService.getAddTransfer = function () {
            return AddTransfer = [{
                type: "Add"
            },
            {
                type: "Transfer"
            }]
        }
        CommonService.getPaymentStatus = function () {
            return PaymentStatus = [{
                type: "Paid"
            },
            {
                type: "Pending"
            }]
        }
        CommonService.compareJSON = function (json1, json2) {
            var objectsDiffering = [];
            compareJSONRecursive(json1, json2, objectsDiffering);
            return objectsDiffering;
        }

        CommonService.compareJSONRecursive = function (json1, json2, objectsDiffering) {
            for (prop in json1) {
                if (json2.hasOwnProperty(prop)) {
                    switch (typeof (json1[prop])) {
                        case "object":
                            compareJSONRecursive(json1[prop], json2[prop], objectsDiffering);
                            break;
                        default:
                            if (json1[prop] !== json2[prop]) {
                                objectsDiffering.push(json1);
                            }
                            break;
                    }
                }
                else {
                    objectsDiffering.push(json1);
                    break;
                }
            }
        }
        return CommonService;
    }]);

