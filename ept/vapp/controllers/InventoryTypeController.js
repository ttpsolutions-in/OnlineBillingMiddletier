ETradersApp.controller("InventoryTypeController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
    $scope.ShowSpinnerStatus = false;

    $scope.showSpinner = function () {
        $scope.ShowSpinnerStatus = true;
    }
    $scope.hideSpinner = function () {
        $scope.ShowSpinnerStatus = false;
    }

    //$scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
    $scope.ID = $routeParams.ID;
    $scope.InventoryTypeList = [];
    $scope.EditInventoryType = {};
    $scope.submitted = false;
    //$scope.ItemCatogoryList = [];
    $scope.InventoryType = {
        InventoryTypeName: ''
        , Active: ''
    };
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

            { width: 350, displayName: 'InventoryType', field: 'InventoryTypeName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center' },
            { width: 150, displayName: 'Active', field: 'Active', enableFiltering: false, enableCellEdit: false, cellTooltip: true, cellClass: 'text-center', headerCellClass: 'text-center' },
            {
                name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditInventoryType/{{row.entity.InventoryTypeId}}" ><span data-feather="edit"></span> </a>'
                    + '</div><script>feather.replace()</script>'
            },
        ],
        data: []
    };

    $scope.SaveInventoryType = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.InventoryTypeList, { InventoryTypeName: $scope.InventoryType.InventoryTypeName }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "Inventory Type already exists!", 5000, 'trustedHtml');
                }
                else {

                    var values = {
                        "InventoryTypeName": $scope.InventoryType.InventoryTypeName
                        , "Active": $scope.InventoryType.Active == true ? '1' : 0
                    };
                    CommonService.PostData("InventoryTypes", values).then(function (response) {
                        //console.log("response " + response);
                        if (response.InventoryTypeId > 0) {
                            toaster.pop('success', "", "Inventory Type saved successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the Save InventoryType function. Exception Logged as " + error.message);
        }
    };

    //Update Materials
    $scope.UpdateInventoryType = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = 0;
                angular.forEach($scope.InventoryTypeList, function (value, key) {
                    if (value.InventoryTypeName == $scope.EditInventoryType.InventoryTypeName && value.InventoryTypeId != $scope.ID) {
                        duplicate = 1;
                        return;
                    }
                });

                if (duplicate ==1 ) {
                    toaster.pop('error', "", "Inventory Type already exists!", 5000, 'trustedHtml');
                }
                else {
                    var values = {
                        "InventoryTypeName": $scope.EditInventoryType.InventoryTypeName
                        , "Active": $scope.EditInventoryType.Active == true ? '1' : '0'
                    };
                    CommonService.UpdateData("InventoryTypes", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Inventory Type Data Updated Successfully", 10000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the Update InventoryType function. Exception Logged as " + error.message);
        }

    };

    $scope.GetInventoryTypeList = function () {
        var lstInventoryType = {
            title: "InventoryTypes",
            fields: ["InventoryTypeId", "InventoryTypeName", "Active"],
            //filter: ["Active eq true"],
            orderBy: "InventoryTypeId desc"
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstInventoryType).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.InventoryTypeList = response.data.d.results;
                $scope.gridOptions.data = $scope.InventoryTypeList;
                $scope.hideSpinner();
            }
        });
    };

    $scope.GetInventoryTypeById = function () {
        var lstInventoryType = {
            title: "InventoryTypes",
            fields: ["InventoryTypeId", "InventoryTypeName", "Active"],
            filter: ["InventoryTypeId eq " + $scope.ID]
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstInventoryType).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.EditInventoryType = response.data.d.results[0];
                $scope.EditInventoryType.Active = $scope.EditInventoryType.Active == 1 ? true : false;
                $scope.hideSpinner();
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/InventoryTypeDashboard');
    };

    $scope.init = function () {
        GlobalVariableService.validateUrl($location.$$path);
        if ($scope.ID>0) {
            $scope.GetInventoryTypeById();
        }
        $scope.GetInventoryTypeList();

    };

    $scope.init();
}]);