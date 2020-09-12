ETradersApp.controller("ItemCategoryController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants) {
    $scope.ShowSpinnerStatus = false;

    $scope.showSpinner = function () {
        $scope.ShowSpinnerStatus = true;
    }
    $scope.hideSpinner = function () {
        $scope.ShowSpinnerStatus = false;
    }

    //$scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
    $scope.ID = $routeParams.ID;
    $scope.ItemCategoryList = [];
    $scope.EditItemCategory = {};
    $scope.submitted = false;
    //$scope.ItemCatogoryList = [];
    $scope.ItemCategory = {
        ItemCategoryName: ''
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

            { width: 400, displayName: 'Name', field: 'ItemCategoryName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 150, displayName: 'Active', field: 'Active', enableFiltering: false, enableCellEdit: false, cellTooltip: true, cellClass: 'text-center', headerCellClass: 'text-center' },
            {
                name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditMaterialCategory/{{row.entity.ItemCategoryId}}" ><span data-feather="edit"></span> </a>'
                    + '</div><script>feather.replace()</script>'
            },
        ],
        data: []
    };

    $scope.SaveItemCategory = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.ItemCategoryList, { ItemCategoryName: $scope.ItemCategory.ItemCategoryName }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "Material Category already exists!", 5000, 'trustedHtml');
                }
                else {
                    var values = {
                        "ItemCategoryName": $scope.ItemCategory.ItemCategoryName
                        , "Active": $scope.ItemCategory.Active == true ? '1' : 0
                    };
                    CommonService.PostData("ItemCategories", values).then(function (response) {
                        console.log("response " + response);
                        if (response.ItemCategoryId > 0) {
                            toaster.pop('success', "", "Material Category Saved Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the Material Category function. Exception Logged as " + error.message);
        }
    };

    //Update Materials
    $scope.UpdateItemCategory = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.ItemCategoryList, function (value, key) {
                    if (value.ItemCategoryName.toUpperCase() == $scope.EditItemCategory.ItemCategoryName.toUpperCase() && value.ItemCategoryId != $scope.ID) {
                        return true;
                    }
                }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "Material Category already exists!", 10000, 'trustedHtml');
                }
                else {
                    var values = {
                        "ItemCategoryName": $scope.EditItemCategory.ItemCategoryName
                        , "Active": $scope.EditItemCategory.Active == true ? '1' : '0'
                    };
                    CommonService.UpdateData("ItemCategories", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Item Category Data Updated Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the UpdateItemCategory function. Exception Logged as " + error.message);
        }
    };


    $scope.GetItemCategoryList = function () {
        var lstItemCategory = {
            title: "ItemCategories",
            fields: ["ItemCategoryId", "ItemCategoryName", "Active"],
            //filter: ["Active eq 1"],
            orderBy: "ItemCategoryId desc"
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstItemCategory).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.ItemCategoryList = response.data.d.results;
                $scope.gridOptions.data = $scope.ItemCategoryList;
                $scope.hideSpinner();
            }
        });
    };

    $scope.GetMaterialCategoryById = function () {
        var lstItemCategory = {
            title: "ItemCategories",
            fields: ["ItemCategoryId", "ItemCategoryName", "Active"],
            filter: ["Active eq 1 and ItemCategoryId eq " + $scope.ID]
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstItemCategory).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.EditItemCategory = response.data.d.results[0];
                $scope.EditItemCategory.Active = $scope.EditItemCategory.Active == 1 ? true : false;
                $scope.hideSpinner();
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/MaterialCategoryDashboard');
    };

    $scope.init = function () {

        GlobalVariableService.validateUrl($location.$$path);
        $scope.GetMaterialCategoryById();
        $scope.GetItemCategoryList();

    };

    $scope.init();
}]);