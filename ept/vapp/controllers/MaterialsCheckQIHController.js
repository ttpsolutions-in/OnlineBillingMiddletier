ETradersApp.controller("MaterialsCheckQIHController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
    $scope.ShowSpinnerStatus = false;

    $scope.showSpinner = function () {
        $scope.ShowSpinnerStatus = true;
    }
    $scope.hideSpinner = function () {
        $scope.ShowSpinnerStatus = false;
    }
    $scope.MaterialList = [];
    $scope.gridOptions = {
        //enableFiltering: true,
        //enableCellEditOnFocus: false,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        enableColumnResizing: true,
        showColumnFooter: false,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
           
            { name: 'MaterialId', field: 'MaterialId', width: 50, enableFiltering: false, enableSorting: true, headerCellClass: 'text-right', cellClass: 'text-right', displayName: '#', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+(grid.options.paginationPageSize*(grid.options.paginationCurrentPage-1))+1}}</div>' },
            { width: 350, displayName: 'Material', field: 'DisplayName', enableFiltering: true, cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 180, displayName: 'Quantity', field: 'TotalIncomingQuantity', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { width: 180, displayName: 'Sold Quantity', field: 'SoldQuantity', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { width: 180, displayName: 'Reorder Level', field: 'ReorderLevel', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { width: 180, displayName: 'QIH', field: 'QIH', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            
        ],
        data: []
    };
    
    $scope.GetMaterialsList = function () {
        var lstBill = {
            title: "ReorderRequireds",
            fields: ["*"],
            orderBy: "QIH desc"
        };
        $scope.showSpinner();
        $scope.MaterialList = [];
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.MaterialList = response.data.d.results;

                angular.forEach($scope.MaterialList, function (value, key) {
                    value.ReorderLevel = Math.trunc(value.ReorderLevel);
                    value.SoldQuantity = Math.trunc(value.SoldQuantity);
                    value.TotalIncomingQuantity = Math.trunc(value.TotalIncomingQuantity);
                    value.QIH = Math.trunc(value.QIH);

                })

                //var ReorderRequiredMaterials = $scope.MaterialList.find(ele=>ele.QIH != undefined)

            }
            $scope.gridOptions.data = $scope.MaterialList;
            $scope.hideSpinner()
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/Materials');
    };

    $scope.init = function () {
        GlobalVariableService.validateUrl($location.$$path);
        $scope.GetMaterialsList();
    };

    $scope.init();
}]);