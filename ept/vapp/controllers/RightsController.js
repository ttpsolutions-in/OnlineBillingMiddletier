ETradersApp.controller("RightsController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
    $scope.ShowSpinnerStatus = false;

    $scope.showSpinner = function () {
        $scope.ShowSpinnerStatus = true;
    }
    $scope.hideSpinner = function () {
        $scope.ShowSpinnerStatus = false;
    }
    $scope.searchRightsName = '';
    $scope.IsMenu = [{MenuId:0},
        {MenuId:1}
    ];
    $scope.Rights = {
        RightsName: '',
        FeatherName : '',
        MenuUrl : '',
        DisplayName : '',
        PID : 0,
        Menu: 0,
        DisplayOrder: 0,
        Active: 1
    }
    $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
    $scope.ID = $routeParams.ID;
    $scope.RightsList = [];
    $scope.EditRights = {};
    $scope.submitted = false;
    
    $scope.gridOptions = {
        enableFiltering: true,
        enableCellEditOnFocus: false,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        enableColumnResizing: true,
        showColumnFooter: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
            { width: 80, displayName: 'Rights ID', field: 'RightsId', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 250, displayName: 'Rights Name', field: 'RightsName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 100, displayName: 'Feather', field: 'FeatherName', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 230, displayName: 'Url', field: 'MenuUrl', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 150, displayName: 'Display Name', field: 'DisplayName', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 80, displayName: 'PID', field: 'PID', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 80, displayName: 'Is Menu', field: 'Menu', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 80, displayName: 'Display Order', field: 'DisplayOrder', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 80, displayName: 'Active', field: 'Active', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            {
                name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditRights/{{row.entity.RightsId}}" ><span data-feather="edit"></span> </a>'
                    + '</div><script>feather.replace()</script>'
            }
        ],
        data: []
    };

    $scope.SaveRights = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;

            if (isValid) {
                var varActive = $scope.Rights.Active == true ? 1 : 0;
                var duplicate = $filter('filter')($scope.RightsList, { RightsName: $scope.Rights.RightsName }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    //sweetAlert("Duplicate", "Rights name already exists!", "error");
                    toaster.pop('error', "", "Rights name already exists!", 5000, 'trustedHtml');
                }
                else {
                    var values = {
                        "RightsName": $scope.Rights.RightsName.toString(),
                        "FeatherName": $scope.Rights.FeatherName.toString(),
                        "MenuUrl": $scope.Rights.MenuUrl.toString(),
                        "DisplayName": $scope.Rights.DisplayName.toString(),
                        "PID": $scope.Rights.PID,
                        "Menu": $scope.Rights.Menu,
                        "DisplayOrder": $scope.Rights.DisplayOrder,
                        "Active": varActive
                    };
                    CommonService.PostData("Rights", values).then(function (response) {
                        console.log("response " + response);
                        if (response.RightsId > 0) {
                            toaster.pop('success', "", "Rights Saved Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the SaveRights function. Exception Logged as " + error.message);
        }
    };

    //Update Rights
    $scope.UpdateRights = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;

            if (isValid) {
                var varActive = $scope.EditRights.Active == true ? 1 : 0;
                var duplicate = $filter('filter')($scope.RightsList, () =>
                { return RightsName == $scope.EditRights.RightsName && RightsId != $scope.ID}, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "Rights name already exists!", 5000, 'trustedHtml');
                }
                else {
                    var values = {
                        "RightsName": $scope.EditRights.RightsName.toString(),
                        "FeatherName": $scope.EditRights.FeatherName.toString(),
                        "MenuUrl": $scope.EditRights.MenuUrl.toString(),
                        "DisplayName": $scope.EditRights.DisplayName.toString(),
                        "PID": $scope.EditRights.PID,
                        "Menu": $scope.EditRights.Menu,
                        "DisplayOrder": $scope.EditRights.DisplayOrder,
                        "Active": varActive
                    };
                    CommonService.UpdateData("Rights", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Rights Data Updated Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the update rights function. Exception Logged as " + error.message);
        }
    };

    $scope.GetDataForDashboard = function () {
        $scope.RightsList = [];
        var lstRights = {
            title: "Rights",
            fields: ["*"],
            //ookupFields: ["ItemCategory"],
            //filter: ["Active eq 1"],
            orderBy: "RightsName"
        };
        if ($scope.searchRightsName !== '') {
            lstRights.filter = "indexof(RightsName,'" + $scope.searchRightsName + "') gt -1";
        }
        CommonService.GetListItems(lstRights).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.RightsList = response.data.d.results;

            }
            else {
                $scope.RightsList = [];

            }
            $scope.gridOptions.data = $scope.RightsList;
            $scope.hideSpinner();
        });
    };
    $scope.GetRightsList = function () {
        var lstBill = {
            title: "Rights",
            fields: ["*"],
            orderBy: "DisplayOrder"
        };

        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.RightsList = response.data.d.results;
                $scope.gridOptions.data = $scope.RightsList;
                $scope.hideSpinner()

            }
        });
    };

    $scope.GetRightsById = function () {
        var lstBill = {
            title: "Rights",
            fields: ["*"],
            filter: ["RightsId eq " + $scope.ID]
            //``orderBy: "CreatedOn desc"
        };
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.EditRights = response.data.d.results[0];
                $scope.EditRights.Active = $scope.EditRights.Active == 1 ? true : false;
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/RightsDashboard');
    };

    $scope.init = function () {
        GlobalVariableService.validateUrl($location.$$path);
        if ($scope.ID > 0)
            $scope.GetRightsById();
        $scope.GetRightsList();

    };

    $scope.init();
}]);