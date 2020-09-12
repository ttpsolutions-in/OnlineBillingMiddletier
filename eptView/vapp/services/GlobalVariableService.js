ETradersApp.factory('GlobalVariableService', ['Config','$http', '$q', '$window', '$location', '$filter',
    function (Config,$http, $q, $window, $location, $filter) {
        var GlobalVariableService = {};
        var materialList = {};
        var MaterialListKey = 'MaterialList';
        var TokenInfoKey = 'TokenInfo';
        var RoleRightsKey = "RoleRights";
        var LoginURl = Config.ServiceBaseURL + '/login.html';
        var tokenInfo = {
            AccessToken: '',
            UserName: '',
            UserRole: ''
        }
        GlobalVariableService.setTokenInfo = function (data) {

            $window.sessionStorage[TokenInfoKey] = JSON.stringify(data);
        }
        GlobalVariableService.setRoleRights = function (data) {

            $window.sessionStorage[RoleRightsKey] = JSON.stringify(data);
        }
        GlobalVariableService.getRoleRights = function () {
            if ($window.sessionStorage[RoleRightsKey]) {
                //console.log($window.sessionStorage[RoleRightsKey]);
                return JSON.parse($window.sessionStorage[RoleRightsKey]);
            }
            else
                $window.location.href = LoginURl
        }
        GlobalVariableService.getTokenInfo = function () {
            if ($window.sessionStorage[TokenInfoKey]) {
                return JSON.parse($window.sessionStorage[TokenInfoKey]);
            }
            else
                $window.location.href=LoginURl;
        }
        GlobalVariableService.setMaterialList = function (data) {

            if ($window.sessionStorage[MaterialListKey] == undefined || $window.sessionStorage[MaterialListKey] == null) {
                $window.sessionStorage[MaterialListKey] = JSON.stringify(data);
            }
        }
        GlobalVariableService.getARights = function (pRoleName, pRightsName) {
            var RoleRights = GlobalVariableService.getRoleRights();
            var checkRights = $filter('filter')(RoleRights, (value, key) => {
                return (value.RoleName == pRoleName && value.RightsName == pRightsName)
            }, true);
            if (checkRights != undefined && checkRights.length > 0) {
                return true;
            }
            else
                return false;

        }

        GlobalVariableService.getMaterialList = function () {
            if ($window.sessionStorage[MaterialListKey] == undefined || $window.sessionStorage[MaterialListKey] == null) {
                $location.path(LoginURl);//return GlobalVariableService.getMaterials();
            }
            else
                return JSON.parse($window.sessionStorage[MaterialListKey]);


        }

        GlobalVariableService.removeToken = function () {

            $window.sessionStorage[TokenInfoKey] = null;
            $window.sessionStorage[MaterialListKey] = null;
            $window.sessionStorage[RoleRightsKey] = null;
        }

        //GlobalVariableService.init = function () {
        //    if ($window.sessionStorage["TokenInfo"]) {
        //        tokenInfo = JSON.parse($window.sessionStorage["TokenInfo"]);
        //    }
        //}

        GlobalVariableService.setHeader = function (http) {
            delete http.defaults.headers.common['X-Requested-With'];

            tokenInfo = JSON.parse($window.sessionStorage[TokenInfoKey]);

            if ((tokenInfo !== undefined) && (tokenInfo.AccessToken !== undefined) && (tokenInfo.AccessToken !== null) && (tokenInfo.AccessToken !== "")) {
                http.defaults.headers.common['Authorization'] = 'Bearer ' + tokenInfo.AccessToken;
                http.defaults.headers.common['Content-Type'] = 'application/json';
            }
        }
        GlobalVariableService.validateUrl = function (pUrl) {
            var AllRights = GlobalVariableService.getRoleRights();
            var invalidPage = true;
            pUrl = pUrl.replace('/', '');
            for (i = 0; i < AllRights.length; i++) {                
                if (pUrl.indexOf(AllRights[i].MenuUrl.replace('#','')) > -1 && AllRights[i].Menu === 1)
                {
                    invalidPage = false;
                    break;
                }
            }
            if (invalidPage)
                $location.path('/invalid');            
        }
        return GlobalVariableService;

    }
]);
