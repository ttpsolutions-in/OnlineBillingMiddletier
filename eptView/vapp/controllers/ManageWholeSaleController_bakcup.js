ETradersApp.controller("ManageWholeSaleController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService) {
    $scope.PageTitle = "Whole Sale";
    $scope.BillNo = "2020-07/01";
    $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
    $scope.WholeSale = {};
    $scope.MaterialLists = [];
    $scope.MaterialsData = [];
    $scope.SupplierRetailers = [];
    $scope.ItemCatogoryList = [];

    $scope.ItemLists = [];
    

    $scope.gridOptions = {
        enableFiltering: false,
        enableCellEditOnFocus: true,
        enableRowSelection: false,
        enableRowHeaderSelection: true,
        enableSelectAll: true,
        enableColumnResizing: true,

        columnDefs: [
            {
                name: 'ID', field: 'ID', visible: false
            },
            {
                name: 'ItemCategoryId', field: 'ItemCategoryId', visible: false
            },
            {
                name: 'DisplayName', displayName: 'Particulars', editableCellTemplate: 'ui-grid/dropdownEditor',
                editDropdownValueLabel: 'DisplayName', editDropdownIdLabel: 'DisplayName'
            },
            { displayName: 'Rate', field: 'Whole_Sale_Rate', cellTooltip: true, enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ displayName: 'Unit', field: 'Unit', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { displayName: 'Quantity', field: 'Quantity', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { displayName: 'Discount', field: 'Discount', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { displayName: 'DLP', field: 'DLP', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ displayName: 'Discount Amt', field: 'Discount Amount', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { displayName: 'Amount', field: 'Amount', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },

        ],
        data: []

    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
            console.log('navigation event');
            $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = $filter('filter')($scope.MaterialsData, { ItemCategoryId: newRowCol.row.entity.ItemCategoryId}, true);
        });

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            row.entity.IsSelected = row.isSelected;
        });
        gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
            angular.forEach(rows, function (row) {
                row.entity.IsSelected = row.isSelected;
            });
        });

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            rowEntity.Whole_Sale_Rate = $filter('filter')($scope.MaterialsData, { DisplayName: rowEntity.DisplayName }, true)[0].Whole_Sale_Rate;

            var amount = parseFloat(rowEntity.Whole_Sale_Rate) * parseFloat(rowEntity.Quantity) + parseFloat(rowEntity.DLP);
            var totalAmount = 0;
            if (rowEntity.Discount > 0) {
                totalAmount = amount / 100 * parseFloat(rowEntity.Discount);
            } else {
                totalAmount = amount;
            }
            rowEntity.Amount = totalAmount;
              
        });
    };
    $scope.GetContactNo = function () {
        $scope.WholeSale.ContactNo = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale.SupplierRetailer }, true)[0].Contact;
    };

    $scope.GetMaterials = function () {
        CommonService.GetMaterials().then(function (response) {
            if (response) {
                $scope.MaterialsData = response;
                console.log($scope.MaterialsData);
            }
        });
    };

    $scope.GetMaterialsByCategoryId = function () {
        CommonService.GetMaterialsByCategoryId($scope.WholeSale.ItemCategory).then(function (response) {
            if (response) {
                $scope.MaterialLists = response;
                $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = $scope.MaterialLists;
                console.log($scope.MaterialLists);
            }
        });
    };

    $scope.GetItemCategory = function () {
        CommonService.GetItemCategory().then(function (response) {
            if (response) {
                $scope.ItemCatogoryList = response;
                console.log($scope.ItemCatogoryList);
            }
        });
    };

    $scope.GetSupplierRetailer = function () {
        CommonService.GetSupplierRetailer().then(function (response) {
            if (response) {
                $scope.SupplierRetailers = response;
                console.log($scope.SupplierRetailers);
            }
        });
    };

    $scope.AddItem = function () {
        if ($scope.WholeSale.ItemCategory != undefined) {
            var item = {

                "MaterialId": 0,
                "ItemCategoryId": $scope.WholeSale.ItemCategory,
                "DisplayName": null,
                "Descriptioin": null,
                "Whole_Sale_Rate": 0,
                "Quantity": 0,
                "Discount": 0,
                "DLP": 0,
                "Amount": 0
            };
            $scope.ItemLists.push(item);
            $scope.gridOptions.data = $scope.ItemLists;
        }
        
    };

    $scope.init = function () {
        $scope.GetItemCategory();
        $scope.GetSupplierRetailer();
        $scope.GetMaterials();
    };

    $scope.init();
}]);