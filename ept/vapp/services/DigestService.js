//Service to call Local Rest API
ETradersApp.factory('DigestService', ['$http',
    function ($http) {
        var DigestService = {};

        //Get Form Digest Token
        DigestService.GetFormDigestToken = function () {
            var req = {
                method: 'POST',
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
                headers: { "Accept": "application/json; odata=verbose" }
            }
            //Return Json File Response
            var promise = $http(req).then(function (response) {
                return response;
            }, function (response) {
                //Exception Handling
                console.log("error=" + JSON.stringify(response));
            });
            return promise;
        };

        return DigestService;
    }]);