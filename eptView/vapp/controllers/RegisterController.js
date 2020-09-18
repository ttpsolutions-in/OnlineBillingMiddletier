ETradersApp.controller("RegisterController", ['Config', '$window', '$scope', '$location', 'LoginService', '$sce', function (Config, $window, $scope, $location, LoginService, $sce) {

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
    $scope.Register = function () {
        var req = {
            "Email": $scope.UserDetails.Email,
            "Password": $scope.UserDetails.Password,
            "ConfirmPassword": $scope.UserDetails.ConfirmPassword
        }
        console.log("reg: " + JSON.stringify(req));

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
                $scope.successMessage = "Create Login successful";
                //$location.path('/next');
            }

        });
    }


    //$scope.Register();
}]);
