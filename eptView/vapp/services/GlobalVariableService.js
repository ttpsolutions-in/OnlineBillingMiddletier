ETradersApp.factory('GlobalVariableService', ['$http', '$q', '$window', 'CommonService','$location',
    function ($http, $q, $window, CommonService, $location) {
        var GlobalVariableService = {};
        var materialList = {};
        var MaterialListKey = 'MaterialList';
        var TokenInfoKey = 'TokenInfo';
        var tokenInfo = {
            accessToken: '',
            UserName: '',
            UserRole: ''
        }
        GlobalVariableService.setTokenInfo = function (data) {

            $window.sessionStorage[TokenInfoKey] = JSON.stringify(data);
        }

        GlobalVariableService.getTokenInfo = function () {
            if ($window.sessionStorage[TokenInfoKey]) {
                return JSON.stringify($window.sessionStorage[TokenInfoKey]);
            }
            else
                $location.path('/login');
        }
        GlobalVariableService.setMaterialList = function (data) {

            if ($window.sessionStorage[MaterialListKey] == undefined || $window.sessionStorage[MaterialListKey] == null) {
                $window.sessionStorage[MaterialListKey] = JSON.stringify(data);
            }
        }

        GlobalVariableService.getMaterialList = function () {
            if ($window.sessionStorage[MaterialListKey] == undefined || $window.sessionStorage[MaterialListKey] == null) {
                $location.path('/login');//return GlobalVariableService.getMaterials();
            }
            else
                return JSON.parse($window.sessionStorage[MaterialListKey]);
            

        }
        GlobalVariableService.getMaterials = function () {
            var lstItems = {
                title: "Materials",
                fields: ["MaterialId", "DisplayName","RetailRate", "WholeSaleRate", "ItemCategoryId", "ItemCategory/ItemCategoryId"],
                lookupFields: ["ItemCategory"],
                orderBy: "DisplayName desc"
            };
            CommonService.GetListItems(lstItems).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    GlobalVariableService.setMaterialList(response.data.d.results);
                    //return JSON.parse($window.sessionStorage["MaterialList"]);
                }
            });

        }
        GlobalVariableService.removeToken = function () {

            $window.sessionStorage[TokenInfoKey] = null;
            $window.sessionStorage[MaterialListKey] = null;
        }

        //GlobalVariableService.init = function () {
        //    if ($window.sessionStorage["TokenInfo"]) {
        //        tokenInfo = JSON.parse($window.sessionStorage["TokenInfo"]);
        //    }
        //}

        GlobalVariableService.setHeader = function (http) {
            delete http.defaults.headers.common['X-Requested-With'];

            tokenInfo = JSON.parse($window.sessionStorage[TokenInfoKey]);

            if ((tokenInfo !== undefined) && (tokenInfo.accessToken !== undefined) && (tokenInfo.accessToken !== null) && (tokenInfo.accessToken !== "")) {
                http.defaults.headers.common['Authorization'] = 'Bearer ' + tokenInfo.accessToken;
                http.defaults.headers.common['Content-Type'] = 'application/json';
            }
        }

        return GlobalVariableService;

    }
]);
