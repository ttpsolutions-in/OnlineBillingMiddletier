
ETradersApp.controller('LoginController', ['Config', '$scope', 'LoginService', 'GlobalVariableService', 'CommonService', '$location', '$window',
    function (Config, $scope, LoginService, GlobalVariableService, CommonService, $location, $window) {

        $scope.UserRights = {
            "GodownView": 0,
            "MasterEdit": 0,
            "MasterView": 0,
            "MaterialCategoryEdit": 0,
            "MaterialCategoryView": 0,
            "MaterialEdit": 0,
            "MaterialInventoryEdit": 0,
            "MaterialInventoryView": 0,
            "MaterialView": 0,
            "RetailEdit": 0,
            "RetailView": 0,
            "Rights": 0,
            "RightsManagementEdit": 0,
            "RightsManagementView": 0,
            "SupplierCustomerEdit": 0,
            "SupplierCustomerView": 0,
            "WholeSaleEdit": 0,
            "WholeSaleView": 0,
        }
        $scope.tokenInfo = {};

        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.loginData = {
            userName: "",
            password: ""
        };
        $scope.errorMessage = '';
        //$scope.IsAuthenticated = false;
        //$scope.userName = '';
        var tokenInfo = {
            AccessToken: '',
            UserName: '',
            UserRole: '',
            UserId:0
        }
        $scope.login = async function () {
            $scope.showSpinner();
            LoginService.login($scope.loginData.userName, $scope.loginData.password).then(function (response) {
                debugger;
                var data = JSON.stringify(response);
                if (data.includes('error')) {
                    console.log("login error: ", data)
                    $scope.errorMessage = response.error_description;
                }
                else {

                    tokenInfo.AccessToken = response.access_token;
                    tokenInfo.UserName = response.userName;
                    tokenInfo.UserRole = '';
                    GlobalVariableService.setTokenInfo(tokenInfo);
                    var lstRole = {
                        title: "EmployeeDetails",
                        fields: ["EmployeeNo","EmpRoleId", "EmployeeRole/RoleName"],
                        lookupFields: ["EmployeeRole"],
                        filter: ["Email eq '" + tokenInfo.UserName + "' and Active eq 1"]//,
                        //orderBy: "EmployeeName"
                    };
                    CommonService.GetListItems(lstRole).then(function (response) {

                        if (response && response.data.d.results.length > 0 && !data.includes('error')) {

                            var result = response.data.d.results[0];

                            tokenInfo.UserRole = result.EmployeeRole.RoleName;
                            tokenInfo.UserId = result.EmployeeNo;
                            GlobalVariableService.setTokenInfo(tokenInfo);
                            //$scope.afterLoginSuccess(tokenInfo.UserRole);                            
                            //$window.location.href = "";

                            CommonService.fetchRoleRights(tokenInfo.UserRole, function () {

                                var redirectUrl = Config.ServiceBaseURL + "/index.html#/home";
                                $window.location.href = redirectUrl;
                            });

                            //console.log("login successful")
                            //$window.location.href = Config.ServiceBaseURL + "/index.html#/WholeSaleDashboard"
                            //$location.path('/WholeSaleDashboard');
                        }
                        else {
                            $scope.errorMessage = "No User Role defined";
                            GlobalVariableService.removeToken();
                        }
                    }, function (error) {
                        $scope.errorMessage = "No User Role defined";
                        console.log(error);
                        GlobalVariableService.removeToken();
                    });

                }
                $scope.hideSpinner();
            });
     
        }
        $scope.logout = function () {
            GlobalVariableService.removeToken();
        }
        $scope.afterLoginSuccess = function (RoleName) {
            CommonService.getMaterials(function () {
                CommonService.fetchRoleRights(RoleName, function () {
                    $window.location.href = Config.ServiceBaseURL + "/index.html#/";
                });
            });
        }
        $scope.init = function () {


        }
        $scope.init();
    }]);
