ETradersApp.controller("GSTController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
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
    $scope.GSTList = [];
    $scope.EditGST = {};
    $scope.submitted = false;
    //$scope.ItemCatogoryList = [];
    $scope.GST = {
        GST: ''
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

            { width: 350, displayName: 'GST %', field: 'GST', cellTooltip: true, enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center' },
            { width: 150, displayName: 'Active', field: 'Active', enableFiltering: false, enableCellEdit: false, cellTooltip: true, cellClass: 'text-center', headerCellClass: 'text-center' },
            {
                name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditGST/{{row.entity.Id}}" ><span data-feather="edit"></span> </a>'
                    + '</div><script>feather.replace()</script>'
            },
        ],
        data: []
    };

    $scope.SaveGST = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.GSTList, { GSTName: $scope.GST.GST }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "GST already exists!", 5000, 'trustedHtml');
                }
                else {

                    var values = {
                        "GST": $scope.GST.GST
                        , "Active": $scope.GST.Active == true ? '1' : 0
                    };
                    CommonService.PostData("GSTPercentages", values).then(function (response) {
                        //console.log("response " + response);
                        if (response.Id > 0) {
                            toaster.pop('success', "", "GST saved successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the SaveGST function. Exception Logged as " + error.message);
        }
    };

    //Update Materials
    $scope.UpdateGST = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = 0;
                angular.forEach($scope.GSTList, function (value, key) {
                    if (value.GST == $scope.EditGST.GST && value.Id != $scope.ID) {
                        duplicate = 1;
                        return;
                    }
                });

                if (duplicate ==1 ) {
                    toaster.pop('error', "", "GST already exists!", 5000, 'trustedHtml');
                }
                else {
                    var values = {
                        "GST": $scope.EditGST.GST
                        , "Active": $scope.EditGST.Active == true ? '1' : '0'
                    };
                    CommonService.UpdateData("GSTPercentages", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "GST Data Updated Successfully", 10000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the UpdateGST function. Exception Logged as " + error.message);
        }

    };

    $scope.GetGSTList = function () {
        var lstGST = {
            title: "GSTPercentages",
            fields: ["Id", "GST", "Active"],
            //filter: ["Active eq true"],
            orderBy: "Id desc"
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstGST).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.GSTList = response.data.d.results;
                $scope.gridOptions.data = $scope.GSTList;
                $scope.hideSpinner();
            }
        });
    };

    $scope.GetGSTById = function () {
        var lstGST = {
            title: "GSTPercentages",
            fields: ["Id", "GST", "Active"],
            filter: ["Id eq " + $scope.ID]
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstGST).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.EditGST = response.data.d.results[0];
                $scope.EditGST.Active = $scope.EditGST.Active == 1 ? true : false;
                $scope.hideSpinner();
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/GSTDashboard');
    };

    $scope.init = function () {
        GlobalVariableService.validateUrl($location.$$path);
        if ($scope.ID>0) {
            $scope.GetGSTById();
        }
        $scope.GetGSTList();

    };

    $scope.init();
}]);