
ETradersApp.controller('indexController', ['GlobalVariableService','$filter', '$scope', '$location', 'LoginService',
    function (GlobalVariableService, $filter, $scope, $location, loginService) {

        $scope.logOut = function () {
            loginService.logOut();
            $location.path('/home');
        }
        $scope.init = function () {
            GlobalVariableService.validateUrl($location.$$path);

            var AllRights =GlobalVariableService.getRoleRights();
            $scope.UserRights = $filter('filter')(AllRights, { Menu: 1 }, true);
            $scope.tokenInfo = GlobalVariableService.getTokenInfo();
        }
        $scope.init();
    }]);