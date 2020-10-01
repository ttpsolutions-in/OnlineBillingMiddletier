
ETradersApp.controller('PaymentOnlineController', ['$http','Config', 'toaster', 'GlobalVariableService', '$filter', '$scope', '$location', 'LoginService', 'CommonService',
    function ($http,Config, toaster, GlobalVariableService, $filter, $scope, $location, loginService, CommonService) {

        $scope.ChangePassword = {
            OldPassword: "",
            NewPassword: "",
            ConfirmPassword: ""
        }
        //$scope.init = function () {

        //    $scope.tokenInfo = GlobalVariableService.getTokenInfo();
        //    if ($scope.tokenInfo) {
        //        CommonService.getMaterials();
        //        GlobalVariableService.validateUrl($location.$$path);
        //        var AllRights = GlobalVariableService.getRoleRights();
        //        $scope.UserRights = $filter('filter')(AllRights, { Menu: 1 }, true);
        //    }

        //}
        $scope.GetSupplierCustomersById = function (email) {
            var lstBill = {
                title: "SupplierRetailers",
                fields: ["*"], //"Category/Id", "Category/CategoryName"
                //filter: ["Email eq '" + email +"'"]//,
                filter: ["Email eq 'ghj@lask.com'"]
                //orderBy: "CreatedOn desc"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierCustomer = response.data.d.results[0];
                }
            });
        };
        $scope.payOnline = function () {
            var lstPayment = {
                "name": $scope.SupplierCustomer.Name.toString(),
                "phone": $scope.SupplierCustomer.Contact.toString(),
                "amount": "100",
                "email": $scope.SupplierCustomer.Email.toString(),
                "description": "Test from C# API",
                "Status": "started",
                "CreatedBy": $scope.tokenInfo.UserName.toString(),
                "CreatedOn":new Date()
            }

            //var url = "https://www.instamojo.com/api/1.1/payment-requests";

            //var req = {
            //    method: 'GET',
            //    cache: false,
            //    url: url,
            //    headers: {
            //       "X-Api-Key": "test_507b4977ec74ee51a22c58b469an",
            //        "X-Auth-Token":"test_83fe3b9a650a0e9f4357fc41d1a"
            //    },
            //    data:"allow_repeated_payments=False&amount=2500&buyer_name=John+Doe&purpose=FIFA+16&redirect_url=http%3A%2F%2Fettest.ttpsolutions.in%2Findex.html#%2FPaymentOnline&phone=9920024852&send_email=True&send_sms=False&email=mung.sukte@gmail.com"
            //}
            ////Return Json File Response
            //$http(req).then(function (response) {
            //    return response;
            //}, function (response) {
            //    //Exception Handling
            //    console.log("error=" + JSON.stringify(response));
            //    return response;
            //});

            CommonService.PostData("OnlinePaymentDetails", lstPayment).then(function (response) {
                if (response != undefined) {
                    toaster.pop('success', "", "Payment done successfully", 5000, 'trustedHtml');
                    console.log(response);
                }
            });

        }
        $scope.init = function () {
            console.log("full url from payment gateway:" + $location.absUrl());
            $scope.tokenInfo = GlobalVariableService.getTokenInfo();
            $scope.GetSupplierCustomersById($scope.tokenInfo.UserName)
        }
        $scope.init();
    }]);