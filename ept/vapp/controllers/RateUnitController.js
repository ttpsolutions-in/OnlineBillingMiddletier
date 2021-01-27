ETradersApp.controller("RateUnitController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
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
    $scope.RateUnitList = [];
    $scope.EditRateUnit = {};
    $scope.submitted = false;
    //$scope.ItemCatogoryList = [];
    $scope.RateUnit = {
         UnitName: ''
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

            { width: 350, displayName: 'Rate Unit', field: 'UnitName', cellTooltip: true, enableCellEdit: false, headerCellClass: 'text-center' },
            { width: 150, displayName: 'Active', field: 'Active', enableFiltering: false, enableCellEdit: false, cellTooltip: true, cellClass: 'text-center', headerCellClass: 'text-center' },
            {
                name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditRateUnit/{{row.entity.UnitId}}" ><span data-feather="edit"></span> </a>'
                    + '</div><script>feather.replace()</script>'
            },
        ],
        data: []
    };

    $scope.SaveRateUnit = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.RateUnitList, { UnitName: $scope.RateUnit.UnitName }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "RateUnit already exists!", 5000, 'trustedHtml');
                }
                else {

                    var values = {
                        "UnitName": $scope.RateUnit.UnitName
                        , "Active": $scope.RateUnit.Active == true ? '1' : 0
                    };
                    CommonService.PostData("Units", values).then(function (response) {
                        //console.log("response " + response);
                        if (response.UnitId > 0) {
                            toaster.pop('success', "", "Rate Unit saved successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the SaveRateUnit function. Exception Logged as " + error.message);
        }
    };

    //Update Materials
    $scope.UpdateRateUnit = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = 0;
                angular.forEach($scope.RateUnitList, function (value, key) {
                    if (value.UnitName == $scope.EditRateUnit.UnitName && value.UnitId != $scope.ID) {
                        duplicate = 1;
                        return;
                    }
                });

                if (duplicate ===1 ) {
                    toaster.pop('error', "", "Rate Unit already exists!", 5000, 'trustedHtml');
                }
                else {
                    var values = {
                        "UnitName": $scope.EditRateUnit.UnitName
                        , "Active": $scope.EditRateUnit.Active == true ? '1' : '0'
                    };
                    CommonService.UpdateData("Units", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response !== undefined) {
                            toaster.pop('success', "", "Rate unit data updated successfully", 10000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the UpdateRateUnit function. Exception Logged as " + error.message);
        }

    };

    $scope.GetRateUnitList = function () {
        var lstRateUnit = {
            title: "Units",
            fields: ["UnitId", "UnitName", "Active"],
            //filter: ["Active eq true"],
            orderBy: "UnitId desc"
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstRateUnit).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.RateUnitList = response.data.d.results;
                $scope.gridOptions.data = $scope.RateUnitList;
                $scope.hideSpinner();
            }
        });
    };

    $scope.GetRateUnitById = function () {
        var lstRateUnit = {
            title: "Units",
            fields: ["UnitId", "UnitName", "Active"],
            filter: ["UnitId eq " + $scope.ID]
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstRateUnit).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.EditRateUnit = response.data.d.results[0];
                $scope.EditRateUnit.Active = $scope.EditRateUnit.Active == 1 ? true : false;
                $scope.hideSpinner();
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/RateUnitDashboard');
    };

    $scope.init = function () {
        GlobalVariableService.validateUrl($location.$$path);
        if ($scope.ID>0) {
            $scope.GetRateUnitById();
        }
        $scope.GetRateUnitList();

    };

    $scope.init();
}]);