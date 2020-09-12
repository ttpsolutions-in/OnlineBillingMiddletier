ETradersApp.controller("GodownController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
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
    $scope.GodownList = [];
    $scope.EditGodown = {};
    $scope.submitted = false;
    //$scope.ItemCatogoryList = [];
    $scope.Godown = {
        GodownName: ''
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

            { width: 350, displayName: 'Godown', field: 'GodownName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 150, displayName: 'Active', field: 'Active', enableFiltering: false, enableCellEdit: false, cellTooltip: true, cellClass: 'text-center', headerCellClass: 'text-center' },
            {
                name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditGodown/{{row.entity.GodownId}}" ><span data-feather="edit"></span> </a>'
                    + '</div><script>feather.replace()</script>'
            },
        ],
        data: []
    };

    $scope.SaveGodown = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.GodownList, { GodownName: $scope.Godown.GodownName }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "Godown name already exists!", 5000, 'trustedHtml');
                }
                else {

                    var values = {
                        "GodownName": $scope.Godown.GodownName
                        , "Active": $scope.Godown.Active == true ? '1' : 0
                    };
                    CommonService.PostData("Godowns", values).then(function (response) {
                        //console.log("response " + response);
                        if (response.GodownId > 0) {
                            toaster.pop('success', "", "Godown name saved successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the SaveGodown function. Exception Logged as " + error.message);
        }
    };

    //Update Materials
    $scope.UpdateGodown = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = 0;
                angular.forEach($scope.GodownList, function (value, key) {
                    if (value.GodownName == $scope.EditGodown.GodownName && value.GodownId != $scope.ID) {
                        duplicate = 1;
                        return;
                    }
                });

                if (duplicate ==1 ) {
                    toaster.pop('error', "", "Godown name already exists!", 5000, 'trustedHtml');
                }
                else {
                    var values = {
                        "GodownName": $scope.EditGodown.GodownName
                        , "Active": $scope.EditGodown.Active == true ? '1' : '0'
                    };
                    CommonService.UpdateData("Godowns", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Godown Data Updated Successfully", 10000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the UpdateGodown function. Exception Logged as " + error.message);
        }

    };

    $scope.GetGodownList = function () {
        var lstGodown = {
            title: "Godowns",
            fields: ["GodownId", "GodownName", "Active"],
            //filter: ["Active eq true"],
            orderBy: "GodownId desc"
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstGodown).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.GodownList = response.data.d.results;
                $scope.gridOptions.data = $scope.GodownList;
                $scope.hideSpinner();
            }
        });
    };

    $scope.GetGodownById = function () {
        var lstGodown = {
            title: "Godowns",
            fields: ["GodownId", "GodownName", "Active"],
            filter: ["GodownId eq " + $scope.ID]
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstGodown).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.EditGodown = response.data.d.results[0];
                $scope.EditGodown.Active = $scope.EditGodown.Active == 1 ? true : false;
                $scope.hideSpinner();
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/GodownDashboard');
    };

    $scope.init = function () {
        GlobalVariableService.validateUrl($location.$$path);
        $scope.GetGodownById();
        $scope.GetGodownList();

    };

    $scope.init();
}]);