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
            if (data !=null)
                $window.localStorage[TokenInfoKey] = JSON.stringify(data);
        }
        GlobalVariableService.setRoleRights = function (data) {
            if (data!=null)
                $window.localStorage[RoleRightsKey] = JSON.stringify(data);
        }
        GlobalVariableService.getRoleRights = function () {
            if ($window.localStorage[RoleRightsKey] !=null) {
                //console.log($window.localStorage[RoleRightsKey]);
                return JSON.parse($window.localStorage[RoleRightsKey]);
            }
            else
                $window.location.href = LoginURl
        }
        GlobalVariableService.getTokenInfo = function (callback) {
            if ($window.localStorage[TokenInfoKey]!=null) {
                return JSON.parse($window.localStorage[TokenInfoKey]);
            }
            else
                $window.location.href = LoginURl;
            if (callback)
                callback();
        }
        GlobalVariableService.setMaterialList = function (data) {

            if (data != undefined && data != null) {
                $window.localStorage[MaterialListKey] = JSON.stringify(data);
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
            if ($window.localStorage[MaterialListKey] == undefined || $window.localStorage[MaterialListKey] == null) {
                $location.path(LoginURl);//return GlobalVariableService.getMaterials();
            }
            else
                return JSON.parse($window.localStorage[MaterialListKey]);


        }

        GlobalVariableService.removeToken = function () {
            $window.localStorage.clear();
            //$window.localStorage[TokenInfoKey] = null;
            //$window.localStorage[MaterialListKey] = null;
            //$window.localStorage[RoleRightsKey] = null;
        }

        //GlobalVariableService.init = function () {
        //    if ($window.localStorage["TokenInfo"]) {
        //        tokenInfo = JSON.parse($window.localStorage["TokenInfo"]);
        //    }
        //}

        GlobalVariableService.setHeader = function (http) {
            delete http.defaults.headers.common['X-Requested-With'];

            tokenInfo = JSON.parse($window.localStorage[TokenInfoKey]);

            if ((tokenInfo !== undefined) && (tokenInfo.AccessToken !== undefined) && (tokenInfo.AccessToken !== null) && (tokenInfo.AccessToken !== "")) {
                http.defaults.headers.common['Authorization'] = 'Bearer ' + tokenInfo.AccessToken;
                http.defaults.headers.common['Content-Type'] = 'application/json';
            }
        }
        GlobalVariableService.validateUrl = function (pUrl) {
            var AllRights = GlobalVariableService.getRoleRights();
            if (AllRights == null)
                $window.location.href = LoginURl;
            var invalidPage = true;
            pUrl = pUrl.replace('/', '');
            for (i = 0; i < AllRights.length; i++) {                
                if (pUrl.indexOf(AllRights[i].MenuUrl.replace('#','')) > -1)// && AllRights[i].Menu === 1)
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
