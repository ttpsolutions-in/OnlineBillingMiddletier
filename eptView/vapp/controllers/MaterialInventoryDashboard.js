ETradersApp.controller("MaterialInventoryDashboardController", ['$scope', '$filter', '$http', '$location', '$routeParams', '$timeout',
    'toaster', 'CommonService', function ($scope, $filter, $http, $location, $routeParams,
        $timeout, toaster, CommonService) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }

        $scope.PageTitle = "Material Inventory";
        //$scope.isAuthenticated = LoginService.isAuthenticated();
        $scope.ID = $routeParams.ID;
        $scope.MaterialInventoryList = [];
        var today = new Date();//.toShortFormat();
        console.log(today.setDate(today.getDate() - 1));

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
                {
                    name: 'ID', field: 'InventoryId', visible: false
                },
                {
                    field: 'DisplayName', width: 250, displayName: 'Material', editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownValueLabel: 'DisplayName', editDropdownIdLabel: 'DisplayName'
                },
                {
                    displayName: 'Godown', field: 'GodownId', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Quantity', field: 'Quantity', type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true,
                    cellClass: function (grid, row) { return row.entity.Quantity < 0 ? 'text-right text-danger' : 'text-right'; },
                    editableCellTemplate: '<input type="number" min="1" required ui-grid-editor ng-model="MODEL_COL_FIELD"><div class="invalid-feedback">Value should be greater than zero.</div>',
                    headerCellClass: 'text-center'
                },
                {
                    displayName: 'Supplier', field: 'SupplierId', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'Name', editDropdownIdLabel: 'Name',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Add Transfer', field: 'AddTransfer', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center',
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'type', editDropdownIdLabel: 'type'
                },
                {
                    displayName: 'Transfer To', field: 'TransferToGodown', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                { displayName: 'Comments', field: 'Comments', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'X', field: 'Action', cellTooltip: true, width: 50, cellClass: 'text-center', headerCellClass: 'text-center', cellTemplate: '<button style="line-height: 0.5;" class="btn btn-danger" ng-click="grid.appScope.Delete(row)"> X</button>' },

            ],
            data: []

        };
                
        $scope.print = function () {
            PrintService.GetWholeSaleByID($scope.ID);
        }

        $scope.GetDataForDashboard = function () {
            $scope.MaterialInventoryList = [];
            var lstBill = {
                title: "Bills",
                fields: [
                    "BillNo"
                    , "SaleDate"
                    , "SupplierRetailer/SupplierRetailerId"
                    , "SupplierRetailer/Name"
                    , "SaleCategory/SaleCategoryId"
                    , "SaleCategory/CategoryName"
                    , "SaleType/SaleTypeId"
                    , "SaleType/SaleType1"
                    , "GSTApplied"
                    , "DiscountApplied"
                    , "CreatedBy"
                    , "CreatedOn"
                    , "UpdatedBy"
                    , "UpdatedOn"
                    , "Status/StatusId"
                    , "Status/StatusName"
                    , "TotalAmount"
                    , "GSTAmount"
                    , "GrandTotal"
                ],
                lookupFields: ["SupplierRetailer", "SaleCategory", "SaleType", "Status"],
                //filter: ["SaleDate ge datetime'" + $scope.searchFromDate.toISOString() + "' and SaleDate le datetime'" + $scope.searchToDate.toISOString() + "'"],
                limitTo: "20",
                orderBy: "BillNo desc"
            };

            if ($scope.searchSupplierRetailer > 0) {
                if (lstBill.filter == undefined)
                    lstBill.filter = "RetailerId eq " + $scope.searchSupplierRetailer;
                else
                    lstBill.filter = lstBill.filter + " and RetailerId eq " + $scope.searchSupplierRetailer;

            }
            if ($scope.searchBillNo != "") {
                if (lstBill.filter == undefined)
                    lstBill.filter = "BillNo eq " + $scope.searchBillNo;
                else
                    lstBill.filter = lstBill.filter + " and BillNo eq " + $scope.searchBillNo;
            }
            //$scope.showSpinner();
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.MaterialInventoryList = response.data.d.results;

                }
                $scope.gridOptions.data = $scope.MaterialInventoryList;
                //  $scope.hideSpinner();
            });
        };

        $scope.GetMaterialInventoryByID = function () {
            var lstBill = {
                title: "Sales",
                fields: [
                    "*",
                    "Bill/SaleDate",
                    "Bill/BillNo",
                    "Bill/RetailerId",
                    "Bill/PaidAmt",
                    "Bill/BalanceAmt",
                    "Bill/GSTApplied",
                    "Bill/SaleTypeId",
                    "Bill/SaleCategoryId",
                    "Material",
                    "Godown/GodownName",
                    "Material/WholeSaleRate",
                    "Material/RetailRate"
                ],
                lookupFields: ["Bill", "Material", "Godown"],
                filter: ["BillNo eq " + $scope.ID],
                //limitTo: "5000",
                orderBy: "CreatedOn desc"
            };

            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.MaterialInventoryList = response.data.d.results;
                    
                    //$scope.WholeSale[0].Bill.Contact = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale[0].Bill.RetailerId }, true)[0].Contact;
                    //$scope.WholeSale[0].Bill.Name = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale[0].Bill.RetailerId }, true)[0].Name;

                }
            });
        };

       

        $scope.GetSupplierRetailers = function () {
            var lstBill = {
                title: "SupplierRetailers",
                fields: ["SupplierRetailerId,Name,Category,Type"],
                //lookupFields: ["SupplierRetailer", "SaleCategory", "SaleType", "Status"],
                filter: ["Category eq " + $scope.Category.Customer],
                //limitTo: "5000",
                orderBy: "CreatedOn desc"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierRetailers = response.data.d.results;
                }
            });
        };
        $scope.RedirectDashboard = function () {
            $location.path('/');
        };

        $scope.init = function () {
            $scope.GetSupplierRetailers();
            //$scope.GetGSTPercentage();
            //if ($scope.ID > 0) {
            //    //$timeout(function () {
            //    $scope.GetWholeSaleByID();
            //    //}, 200);

            //}
            //else {
                $scope.GetDataForDashboard();
            //}
        };

        $scope.init();
    }]);