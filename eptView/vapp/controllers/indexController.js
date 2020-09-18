
ETradersApp.controller('indexController', ['Config', 'GlobalVariableService', '$filter', '$scope', '$location', 'LoginService', 'CommonService',
    function (Config, GlobalVariableService, $filter, $scope, $location, loginService, CommonService) {

        $scope.ChangePassword = {
            OldPassword: "",
            NewPassword: "",
            ConfirmPassword: ""
        }

        $scope.logOut = function () {
            loginService.logOut();
            $window.location.href = Config.ServiceBaseURL + "/login.html";
        }
        $scope.ChangePassword = function () {
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

        $scope.init = function () {

            $scope.tokenInfo = GlobalVariableService.getTokenInfo();
            if ($scope.tokenInfo) {
                CommonService.getMaterials();
                GlobalVariableService.validateUrl($location.$$path);
                var AllRights = GlobalVariableService.getRoleRights();
                $scope.UserRights = $filter('filter')(AllRights, { Menu: 1 }, true);
            }

        }
$scope.isCollapsed = true;
$scope.init();
    }]);