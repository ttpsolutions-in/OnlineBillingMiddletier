
ETradersApp.controller('homeController', ['$window','Config', 'GlobalVariableService', '$filter', '$scope', '$location', 'LoginService', 'CommonService',
    function ($window,Config, GlobalVariableService, $filter, $scope, $location, loginService, CommonService) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.ChangePassword = {
            OldPassword: "",
            NewPassword: "",
            ConfirmPassword: ""
        }
        $scope.clear = function () {
            $scope.ChangePassword.OldPassword = "";
            $scope.ChangePassword.NewPassword = "";
            $scope.ChangePassword.ConfirmPassword = ""
        }
        $scope.logOut = function () {
            loginService.logOut();
            $window.location.href = Config.ServiceBaseURL + "/login.html";
        }
        $scope.ChangePassword = function (isFormValid) {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var req = {
                    "OldPassword": $scope.ChangePassword.OldPassword,
                    "NewPassword": $scope.ChangePassword.NewPassword,
                    "ConfirmPassword": $scope.ChangePassword.ConfirmPassword
                }
                console.log("reg: " + JSON.stringify(req));

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
                        $scope.successMessage = "Password change successful";
                        GlobalVariableService.removeToken();
                    }

                });
            }
        }

        $scope.init = function () {
            $scope.showSpinner()
            $scope.tokenInfo = GlobalVariableService.getTokenInfo();
            if ($scope.tokenInfo) {
                GlobalVariableService.validateUrl($location.url());
                //if (GlobalVariableService.getMaterialList() == null)
                    //CommonService.getMaterials($scope.hideSpinner());                
                var AllRights = GlobalVariableService.getRoleRights();
                $scope.UserRights = $filter('filter')(AllRights, { Menu: 1 }, true);
            }

        }
$scope.isCollapsed = true;
$scope.init();
    }]);
