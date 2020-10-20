ETradersApp.controller("RegisterController", ['CommonService', 'Config', '$window', '$scope', '$location', 'LoginService', '$sce',
    function (CommonService, Config, $window, $scope, $location, LoginService, $sce) {

        $scope.UserDetails = {
            Email: "",
            Password: "",
            ConfirmPassword: ""
        }
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.goTologin = function () {

            $window.location.href = Config.ServiceBaseURL + "/login.html";
        }
        $scope.ConfirmPassword = function (isFormValid) {
            $scope.submitted = !isFormValid
            if (isFormValid) {

                var req = {
                    "OldPassword": $scope.UserDetails.OldPassword,
                    "NewPassword": $scope.UserDetails.NewPassword,
                    "ConfirmPassword": $scope.UserDetails.ConfirmPassword
                }

                LoginService.ChangePassword(req).then(function (response) {
                    var str = ''
                    $scope.errorMessage = '';
                    $scope.successMessage = '';

                    if (response.data.ModelState) {
                        for (var key in response.data.ModelState) {
                            if (key !== "$id")
                                str += "<span class='pull-left'>" + response.data.ModelState[key] + "</span>";
                        }
                        $scope.errorMessage = $sce.trustAsHtml(str);
                    }
                    else {
                        $scope.successMessage = $sce.trustAsHtml("<span class='pull-left'>Password changed successfully</span>");
                        GlobalVariableService.removeToken();
                    }

                });
            }


        }
    $scope.Register = function (isFormValid) {
        $scope.submitted = !isFormValid
        if (isFormValid) {
            $scope.GetEmailById($scope.UserDetails.Email,function () {
                if ($scope.EmailFound) {
                    var req = {
                        "Email": $scope.UserDetails.Email,
                        "Password": $scope.UserDetails.Password,
                        "ConfirmPassword": $scope.UserDetails.ConfirmPassword
                    }

                    LoginService.Register(req).then(function (response) {
                        var str = ''
                        $scope.errorMessage = '';
                        $scope.successMessage = '';

                        if (response.data.ModelState) {
                            for (var key in response.data.ModelState) {
                                if (key !== "$id")
                                    str += "<span class='pull-left'>" + response.data.ModelState[key] + "</span>";
                            }
                            $scope.errorMessage = $sce.trustAsHtml(str);
                        }
                        else {
                            $scope.successMessage = $sce.trustAsHtml("<span class='pull-left'>Login created successfully</span>");
                            //$location.path('/next');
                        }

                    });
                }
                else
                    $scope.errorMessage = $sce.trustAsHtml("<span class='pull-left'>Email address not exists in the system.</span>");
            });
        }
        }

    $scope.GetEmailById = function (email, callback) {
        $scope.EmailFound = false;
        var lstemp = {
            title: "EmployeeDetails",
            fields: ["Email"],
            filter: ["Email eq '" + email + "'"]
         };
        CommonService.GetListItems(lstemp).then(function (response) {
            if (response && response.data.d.results.length == 0) {
                var lstsup = {
                    title: "SupplierRetailers",
                    fields: ["Email"],
                    filter: ["Email eq '" + email + "'"]
                    
                };
                CommonService.GetListItems(lstsup).then(function (response) {
                    if (response && response.data.d.results.length > 0) {
                        $scope.EmailFound = true;
                    }
                    if (callback)
                        callback();                 
                });
            }        
            else {
                $scope.EmailFound = true;
                if (callback)
                    callback();
            }
            
    });
    };

    //$scope.Register();
}]);
