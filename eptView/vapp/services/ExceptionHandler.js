//Service to Handle exception
ETradersApp.factory('ExceptionHandler', ['$location', '$alert', function ($location,$alert) {

    var ExceptionHandler = {};

    ExceptionHandler.HandleException = function (response) {
        if (response == null)
            return ExceptionHandler;

        if (response.status == 404) {
            $alert({
                "title": "Error!",
                "content": "The resource you are looking for is not avaliable, please check the url.",
                "type": "danger",
                "show": true,
                "placement": "top-right",
                "duration": 5
            });
        } else if (response.status == 406) {
            alert("Your session has been expired, to continue please re-login.");
            window.location.href = "Login.aspx";
        } else if (response.status == 400) {
            console.log(response);
            alert("Insufficient information, please check whether all the information is filled properly.");
        }
        else if (response.status == 403) {
            $alert({
                "title": "Error!",
                "content": response.data,
                "type": "danger",
                "show": true,
                "placement": "top-right",
                "duration": 5
            });
        }
        else if (response == 500) {
            alert("Insufficient information, please check whether all the information is filled properly.");
        }
        else if (response == 'Your Session has been expired, please relogin.') {
            alert("Your session has been expired, to continue please re-login.");
            $location.path = '/login';
        }
        else {
            alert("Unknown error occurs while processing your request, notification of error has been sent to administrator.");
        };
    };
    
    return ExceptionHandler;
}]);

