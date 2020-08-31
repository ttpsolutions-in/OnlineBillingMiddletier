ETradersApp.controller("RegisterController", ['$scope', '$location', 'LoginService', '$sce', function ($scope, $location, LoginService, $sce) {

    $scope.UserDetails = {
        Email: "",
        Password: "",
        ConfirmPassword: ""
    }
    $scope.errorMessage = '';
    $scope.successMessage = '';

    $scope.Register = function () {
        var req = {
            "Email": $scope.UserDetails.Email,
            "Password": $scope.UserDetails.Password,
            "ConfirmPassword": $scope.UserDetails.ConfirmPassword
        }
        console.log("reg: " + JSON.stringify(req));

        LoginService.Register(req).then(function (response) {
            debugger;
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
                $scope.successMessage = "Registration Successful";
                //$location.path('/next');
            }

        });
    }
    //$scope.Register();
}]);
