ETradersApp.controller("RightsManagementController", ['$timeout', 'GlobalVariableService', '$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function ($timeout, GlobalVariableService, $scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.searchCategory = '';
        $scope.searchDisplayName = '';
        $scope.searchDescription = '';
        $scope.MainRoleId = 0;
        //$scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.ID = $routeParams.ID;
        $scope.RightsManagementList = [];
        $scope.EmployeeRolesList = [];
        $scope.EditRightsManagement = {};
        $scope.RightsManagement = {
            "RightsManagementId": 0
            , "RoleId": 0
            , "RightsId": 0
            , "Active": 1

        }
        $scope.submitted = false;
        //$scope.ItemCatogoryList = [];

        $scope.gridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: false,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            enableColumnResizing: true,
            showColumnFooter: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 50,
            columnDefs: [

                //{ width: 100, displayName: 'Rights Management Id', field: 'RightsManagementId', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { width: 250, displayName: 'Rights', field: 'RightsName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                {
                    width: 250, displayName: 'Role', field: 'RoleName', enableFiltering: false, enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left',
                    headerCellClass: 'text-center'
                },
                {
                    width: 80, displayName: 'Active', field: 'RMActive', enableFiltering: false, enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-center',
                    headerCellClass: 'text-center',
                    cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<input type="checkbox" ng-checked="row.entity.RMActive==1?true:false" ng-click="grid.appScope.updateActive(row)" ng-model="row.entity.RMActive" id="Active" class="form-control"/>'
                        + '</div>'
                },
                //{
                //    name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                //        + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditRightsManagement/{{row.entity.RightsManagementId}}" ><span data-feather="edit"></span> </a>'
                //        + '</div><script>feather.replace()</script>'
                //},
                { displayName: 'RightsManagementId', field: 'RightsManagementId', enableCellEdit: false, visible: false },
                { displayName: 'RightsId', field: 'RightsId', enableCellEdit: false, visible: false },
                { displayName: 'RoleId', field: 'RoleId', enableCellEdit: false, visible: false }
            ],
            data: []
        };
        $scope.updateActive=function(params) {
            if (params.entity.RMActive === 0)
                params.entity.RMActive = 1;
            else
                params.entity.RMActive = 0;
        }
        $scope.SaveRightsManagements = function () {
            try {

                $scope.SaveProcess(function () {

                    $scope.RightsManagementList = [];
                    $scope.gridOptions.data = null;
                    toaster.pop('success', "", "Role Rights Detail Saved Successfully", 5000, 'trustedHtml');
                    //$scope.RedirectDashboard();
                    $scope.GetDataForDashboard();
                    
                });

            } catch (error) {
                console.log("Exception caught in the Save Role Rights detail function. Exception Logged as " + error.message);
            }
        };

        $scope.SaveProcess = function (callback) {

            angular.forEach($scope.gridOptions.data, function (value, key) {

                var values = {
                    //"RightsManagementId": value.RightsManagementId
                    "RightsId": value.RightsId
                    , "RoleId": $scope.MainRoleId
                    , "Active": value.RMActive == true ? 1 : 0
                };
                if (value.RoleId == 0 || value.RoleId == undefined) {

                    CommonService.PostData("RightsManagements", values).then(function (response1) {

                    }, function (data) {
                        console.log(data);
                    });
                }
                else {

                    CommonService.UpdateData("RightsManagements", values, value.RightsManagementId).then(function (response) {
                    }, function (data) {
                        console.log(data);
                    });

                }
            });
            if (callback)
                callback();

        }
        //Update Employees
        $scope.UpdateRightsManagements = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;

                if (isValid) {
                    var varActive = $scope.EditRightsManagement.Active == true ? 1 : 0;
                    var duplicate = $filter('filter')($scope.RightsManagementList, { RightsId: $scope.EditRightsManagement.RightsId, RoleId: $scope.EditRightsManagement.RoleId, Active: varActive }, true)
                    if (duplicate != undefined && duplicate.length > 0) {
                        //toaster.pop('error', "", "Role Rights Already Exists!", 5000, 'trustedHtml');
                        sweetAlert("Error", "Role Rights Already Exists!", "error");
                    }
                    else {

                        var values = {
                            "RightsManagementId": $scope.EditRightsManagement.RightsManagementId
                            , "RightsId": $scope.EditRightsManagement.RightsId
                            , "RoleId": $scope.EditRightsManagement.RoleId
                            , "Active": $scope.EditRightsManagement.Active == true ? 1 : 0
                        };
                        CommonService.UpdateData("RightsManagements", values, $scope.ID).then(function (response) {
                            console.log("response " + response);
                            if (response != undefined) {
                                toaster.pop('success', "", "Role Rights Details Updated Successfully", 5000, 'trustedHtml');
                                $scope.RedirectDashboard();
                            }
                        }, function (data) {
                            console.log(data);
                        });
                    }

                }
            } catch (error) {
                console.log("Exception caught in the update Role Rights function. Exception Logged as " + error.message);
            }
        };

        $scope.GetRights = function (callback) {
            var postData = {
                title: "Rights",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.Rights = response.data.d.results;
                }
                callback();
            });
        };
        $scope.GetDataForDashboard = function () {

            $scope.RightsManagementList = [];
            $scope.gridOptions.data = null;

            var roleName = $filter('filter')($scope.EmployeeRolesList, { EmpRoleId: $scope.MainRoleId }, true)[0].RoleName;
            var lstRightsManagement = {
                title: "RightsForAssignments",
                fields: ["*"],
                //lookupFields: ["EmployeeRole", "Right"],
                filter: ["RoleName eq '" + roleName + "'"],
                //limitTo: 20,
                //orderBy: "EmployeeRole/RoleName"
            };

            CommonService.GetListItems(lstRightsManagement).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.RightsManagementList = response.data.d.results;

                }
                else {
                    $scope.RightsManagementList = [];

                }
                $scope.gridOptions.data = $scope.RightsManagementList;
                //$scope.hideSpinner();
            });
        }
        $scope.GetEmployeeRoles = function (callback) {
            var lstRoles = {
                title: "EmployeeRoles",
                fields: ["*"],//,"ItemCategory/ItemCategoryName"],
                filter: ["Active eq 1"]
                //lookupFields: ["ItemCategory"],

            };
            CommonService.GetListItems(lstRoles).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeRolesList = response.data.d.results;
                    //$scope.gridOptions.data = $scope.MaterialList;
                    //$scope.hideSpinner()
                    if (callback)
                        callback();
                }

            });
        };

        $scope.GetRightsManagementById = function () {
            var lstRightsManagement = {
                title: "RightsManagements",
                fields: ["*", "EmployeeRole/RoleName", "Right/RightsName"],
                filter: ["RightsManagementId eq " + $scope.ID],
                lookupFields: ["EmployeeRole", "Right"],
                orderBy: "Right/RightsName"
            };
            CommonService.GetListItems(lstRightsManagement).then(function (response) {
                if (response && response.data.d.results.length > 0) {

                    $scope.EditRightsManagement = response.data.d.results[0];
                    $scope.EditRightsManagement.Active = $scope.EditRightsManagement.Active == 1 ? true : false
                }
            });
        };

        $scope.RedirectDashboard = function () {
            $location.path('/RightsManagementDashboard');
        };

        $scope.init = function () {

            GlobalVariableService.validateUrl($location.$$path);

            $scope.GetEmployeeRoles(function () {
                $scope.GetRights(function () {
                    if ($scope.ID > 0)
                        $scope.GetRightsManagementById();
                    //$scope.GetDataForDashboard();                    
                });
            });
        };

        $scope.init();
    }]);