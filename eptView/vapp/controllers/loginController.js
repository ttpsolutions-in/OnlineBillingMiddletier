
ETradersApp.controller('LoginController', ['$scope', 'LoginService', 'GlobalVariableService', 'authData', '$location', 'AuthenticationData', function ($scope, LoginService, GlobalVariableService, authData, $location, AuthenticationData) {
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
        accessToken: '',
        UserName: '',
        UserRole: ''
    }
        $scope.login = function () {
            $scope.showSpinner();
            LoginService.login($scope.loginData.userName, $scope.loginData.password).then(function (response) {
                debugger;
                var data = JSON.stringify(response);
                if (data.includes('error')) {

                    $scope.IsAuthenticated = authData.authenticationData.IsAuthenticated = false;
                    $scope.userName = authData.authenticationData.userName = "";
                    console.log("login error: ", data)
                    $scope.errorMessage = response.error_description;
                }
                else {
                    
                    tokenInfo.accessToken = response.accessToken;
                    tokenInfo.UserName = response.userName;
                    tokenInfo.UserRole = '';

                    GlobalVariableService.setTokenInfo(tokenInfo);

                    GlobalVariableService.getMaterials();
                    console.log("login successful")
                    $location.path('/WholeSaleDashboard');
                    //debugger;
                }
                $scope.hideSpinner();
            });
        }
    $scope.logout = function () {
        GlobalVariableService.removeToken();
        authData.authenticationData.IsAuthenticated = false;
        authData.authenticationData.userName = "";

    }
    $scope.init = function () {

        $scope.IsAuthenticated = authData.authenticationData.IsAuthenticated;
        $scope.userName = authData.authenticationData.userName;        
    }
    $scope.init();
}]);
