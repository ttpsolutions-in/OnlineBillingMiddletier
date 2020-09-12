
ETradersApp.service('LoginService', ['Config','$http', '$q', 'GlobalVariableService', 'ExceptionHandler',
    function (Config,$http, $q, GlobalVariableService, ExceptionHandler) {

        var loginServiceURL = Config.ServiceBaseURL + '/token';
        
        var tokenInfo = {
            accessToken: '',
            UserName: '',
            UserRole: '',
            isAuthenticated:false
        }
        this.login = function (userName, password) {
            deferred = $q.defer();
            var bodyData = "grant_type=password&username=" + userName + "&password=" + password;
            var req = {
                method: 'POST',
                cache: false,
                url: loginServiceURL,
                headers: {
                    "Accept": "application/json; odata=verbose",
                    'Content-Type': 'application/json'
                },
                data: bodyData
            }
            //Return Json File Response
            var promise = $http(req).then(function (response) {
                                
                return response.data;

            }, function (error) {                   
                //Exception Handling
                    //console.log("error=" + JSON.stringify(error));
                    //ExceptionHandler.HandleException(error);
                return error.data;
            });

            return promise;           
            
        }
        
        this.Register = function (data) {
            var req = {
                method: 'POST',
                cache: false,
                url: Config.ServiceBaseURL + '/api/Account/Register',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            //debugger;
            var promise = $http(req).then(function (response) {
                return response;
            }, function (error) {
                //Exception Handling
                    console.log("error at Register :" + JSON.stringify(error))
                    ExceptionHandler.HandleException(error);
                    return error;
            });
            return promise;
        }
        this.logOut = function () {
            GlobalVariableService.removeToken();            
        }
    }
    ]);
