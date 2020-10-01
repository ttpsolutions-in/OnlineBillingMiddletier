ETradersApp.controller("MaterialInventoryDashboardController", ['GlobalVariableService', '$scope', '$filter', '$http', '$location', '$routeParams', '$timeout',
    'toaster', 'CommonService', function (GlobalVariableService, $scope, $filter, $http, $location, $routeParams,
        $timeout, toaster, CommonService) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }

        $scope.PageTitle = "Material Inventory";


        $scope.ID = $routeParams.ID;
        $scope.MaterialInventoryList = [];
        $scope.ItemCatogoryList = [];
        $scope.subMaterialLists = [];
        $scope.searchItemCategoryId = null;
        $scope.GodownData = [];

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
                    field: 'Material.DisplayName', width: 300, displayName: 'Material', enableCellEdit: false//, editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownValueLabel: 'DisplayName', editDropdownIdLabel: 'DisplayName'
                },

                {
                    displayName: 'Quantity', field: 'Quantity', width: 80, type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true,
                    cellClass: function (grid, row) { return row.entity.Quantity < 0 ? 'text-right text-danger' : 'text-right'; },
                    editableCellTemplate: '<input type="number" min="1" required ui-grid-editor ng-model="MODEL_COL_FIELD"><div class="invalid-feedback">Value should be greater than zero.</div>',
                    headerCellClass: 'text-center'
                },
                {
                    displayName: 'Amount', field: 'Amount', width: 80, type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true,
                    cellClass: function (grid, row) { return row.entity.Quantity < 0 ? 'text-right text-danger' : 'text-right'; },
                    editableCellTemplate: '<input type="number" min="1" required ui-grid-editor ng-model="MODEL_COL_FIELD"><div class="invalid-feedback">Value should be greater than zero.</div>',
                    headerCellClass: 'text-center'
                },
                {
                    displayName: 'Supplier', field: 'SupplierRetailer.Name', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'Name', editDropdownIdLabel: 'Name',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Payment Status', field: 'PaymentStatus', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center',
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'type', editDropdownIdLabel: 'type'
                },
                {
                    displayName: 'Add/Transfer', field: 'AddTransfer', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center',
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'type', editDropdownIdLabel: 'type'
                },
                {
                    displayName: 'Godown', field: 'Godown.GodownName', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Transfer To', field: 'Godown1.GodownName', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },

                { displayName: 'Comments', field: 'Comments', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ displayName: 'X', field: 'Action', cellTooltip: true, width: 50, cellClass: 'text-center', headerCellClass: 'text-center', cellTemplate: '<button style="line-height: 0.5;" class="btn btn-danger" ng-click="grid.appScope.Delete(row)"> X</button>' },
                {
                    name: 'Action', width: 120, enableFiltering: false, displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<a id="btnView" type="button" title="delete" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#" ng-click="grid.appScope.Update(row,0)" ><span data-feather="trash-2"></span> </a>'
                        //+ '</div><script>feather.replace()</script>'
                        + '&nbsp;&nbsp;<a id="btnEdit" type="button" title="save" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#" ng-click="grid.appScope.Update(row,1)" ><span data-feather="save"></span> </a>'
                        + '</div><script>feather.replace()</script>'
                },
                {
                    name: 'StoreGodownId', field: 'GodownId', visible: false
                },
                {
                    name: 'StoreSupplierId', field: 'SupplierId', visible: false
                },
                {
                    name: 'StoreTransferToGodownId', field: 'TransferToGodown', visible: false
                },
                {
                    name: 'StoreMaterialId', field: 'MaterialId', visible: false
                }
            ],
            data: []

        };
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            //console.log($scope.gridApi)
            gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                //$scope.showSpinner();

                switch (newRowCol.col.field) {
                    //case "DisplayName":
                    //    if (newRowCol.row.entity.MaterialCategoryId == undefined)
                    //        CategoryId = $scope.ItemCategoryId;
                    //    else
                    //        CategoryId = newRowCol.row.entity.MaterialCategoryId;
                    //    var tempMateriallist = GlobalVariableService.getMaterialList();
                    //    $scope.currentMaterialLst = $filter('filter')(tempMateriallist, { ItemCategoryId: CategoryId }, true);
                    //    $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = $scope.currentMaterialLst;
                    //    break;
                    case "SupplierRetailer.Name":
                        $scope.gridOptions.columnDefs[4].editDropdownOptionsArray = $scope.SupplierRetailers;
                        break;
                    case "PaymentStatus":
                        $scope.gridOptions.columnDefs[5].editDropdownOptionsArray = CommonService.getPaymentStatus();
                        break;
                    case "AddTransfer":
                        $scope.gridOptions.columnDefs[6].editDropdownOptionsArray = CommonService.getAddTransfer();
                        break;
                    case "Godown.GodownName":
                        $scope.gridOptions.columnDefs[7].editDropdownOptionsArray = $scope.GodownData;
                        break;
                    case "Godown1.GodownName":
                        $scope.gridOptions.columnDefs[8].editDropdownOptionsArray = $scope.GodownData;
                        break;
                }

                //var tempMateriallist = GlobalVariableService.getMaterialList();
                //$scope.currentMaterialLst = $filter('filter')(tempMateriallist, { ItemCategoryId: newRowCol.row.entity.ItemCategoryId }, true);
                //$scope.gridOptions.columnDefs[1].editDropdownOptionsArray = $scope.currentMaterialLst;
                //$scope.gridOptions.columnDefs[3].editDropdownOptionsArray = $scope.SupplierRetailers;// $filter('filter')($scope.currentMaterialLst, { ItemCategoryId: newRowCol.row.entity.ItemCategoryId }, true);
                //$scope.gridOptions.columnDefs[5].editDropdownOptionsArray = CommonService.getPaymentStatus();
                //$scope.gridOptions.columnDefs[6].editDropdownOptionsArray = CommonService.getAddTransfer();
                //$scope.gridOptions.columnDefs[7].editDropdownOptionsArray = $scope.GodownData;
                //$scope.gridOptions.columnDefs[8].editDropdownOptionsArray = $scope.GodownData;
                ////$scope.hideSpinner();
            });

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                row.entity.IsSelected = row.isSelected;
                $scope.IsItemSelected = row.isSelected;
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                angular.forEach(rows, function (row) {
                    row.entity.IsSelected = row.isSelected;
                    $scope.IsItemSelected = row.isSelected;
                });
            });

            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                //var tempMateriallist = GlobalVariableService.getMaterialList();
                //$scope.currentMaterialLst = $filter('filter')(tempMateriallist, { ItemCategoryId: newRowCol.row.entity.ItemCategoryId }, true);

                if (parseFloat(newValue) != parseFloat(oldValue)) {
                    rowEntity.Quantity = rowEntity.Quantity == null ? 0 : rowEntity.Quantity;
                    rowEntity.Amount = rowEntity.Amount == null ? 0 : rowEntity.Amount;
                    //rowEntity.MaterialId = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].MaterialId;
                    rowEntity.GodownId = $filter('filter')($scope.GodownData, { GodownName: rowEntity.Godown.GodownName }, true)[0].GodownId;
                    rowEntity.TransferToGodownId = $filter('filter')($scope.GodownData, { GodownName: rowEntity.Godown1.GodownName }, true)[0].GodownId;
                    rowEntity.SupplierId = $filter('filter')($scope.SupplierRetailers, { Name: rowEntity.SupplierRetailer.Name }, true)[0].SupplierRetailerId;

                    /*switch (colDef.field) {
                        case "Quantity":
                            rowEntity.Quantity = rowEntity.Quantity == null ? 0 : rowEntity.Quantity;
                            break;
                        case "DisplayName":
                            rowEntity.MaterialId = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].MaterialId;
                            break;
                        case "GodownId":
                            rowEntity.GodownId = $filter('filter')($scope.GodownData, { GodownName: rowEntity.GodownName }, true)[0].GodownId;
                            break;
                        case "TransferToGodown":
                            rowEntity.TransferToGodownId = $filter('filter')($scope.GodownData, { GodownName: rowEntity.TransferToGodown }, true)[0].GodownId;
                            break;
                        case "SupplierId":
                            rowEntity.SupplierId = $filter('filter')($scope.SupplierCustomers, { Name: rowEntity.SupplierId }, true)[0].SupplierRetailerId;
                            break;

                    }*/
                }
            });

        };
        $scope.print = function () {
            PrintService.GetWholeSaleByID($scope.ID);
        }

        $scope.GetDataForDashboard = function () {
            $scope.MaterialInventoryList = [];
            var lstBill = {
                title: "MaterialInventories",
                fields: [
                    "InventoryId"
                    , "Material/DisplayName"
                    , "Amount"
                    , "PaymentStatus"
                    , "GodownId"
                    , "Godown/GodownName"
                    , "Quantity"
                    , "SupplierRetailer/Name"
                    , "AddTransfer"
                    , "Godown1/GodownName"
                    , "Comments"
                    , "Active"
                ],
                lookupFields: ["SupplierRetailer", "Godown", "Godown1", "Material"],
                filter: ["Active eq 1"],
                //limitTo: "20",
                orderBy: "InventoryId desc"
            };

            if ($scope.searchSupplierRetailer > 0) {
                if (lstBill.filter == undefined)
                    lstBill.filter = "SupplierId eq " + $scope.searchSupplierRetailer;
                else
                    lstBill.filter = lstBill.filter + " and SupplierId eq " + $scope.searchSupplierRetailer;

            }
            if ($scope.searchMaterialId != undefined && $scope.searchMaterialId != "") {
                if (lstBill.filter == undefined)
                    lstBill.filter = "MaterialId eq " + $scope.searchMaterialId;
                else
                    lstBill.filter = lstBill.filter + " and MaterialId eq " + $scope.searchMaterialId;
            }
            if ($scope.searchGodownId != undefined && $scope.searchGodownId != "") {
                if (lstBill.filter == undefined)
                    lstBill.filter = "GodownId eq " + $scope.searchGodownId;
                else
                    lstBill.filter = lstBill.filter + " and GodownId eq " + $scope.searchGodownId;
            }

            //$scope.showSpinner();
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.MaterialInventoryList = response.data.d.results;
                    $scope.GetTotalQuantityNPending();

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
        $scope.clear = function () {
            $scope.searchItemCategoryId = null;
            $scope.searchSupplierRetailer =null
            $scope.searchMaterialId =null;            
            $scope.searchGodownId;
            $scope.gridOptions.data = [];
        }
        $scope.Delete = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.DeletedRows.push(row.entity);
            $scope.gridOptions.data.splice(index, 1);
        };

        $scope.Update = function (row, mode) {
            var InventoryId = row.entity.InventoryId;
            var postData = [];
            var active = 1;
            var answer = true;
            if (mode === 0) {
                answer = confirm("Are you sure you want to delete '" + row.entity.Material.DisplayName + "' entry?")
                active = 0;

            }
            if (!answer) {
                //ev.preventDefault();
                return;
            }
            try {

                postData = {
                    "InventoryId": InventoryId,
                    "SupplierId": row.entity.SupplierId,
                    "GodownId": row.entity.GodownId,
                    "TransferToGodown": row.entity.TransferToGodownId,
                    "Quantity": row.entity.Quantity.toString(),
                    "Amount": row.entity.Amount.toString(),
                    "PaymentStatus": row.entity.PaymentStatus.toString(),
                    "AddTransfer": row.entity.AddTransfer.toString(),
                    //"MaterialId": row.entity.MaterialId,
                    "UpdatedDate": new Date(),
                    "UpdatedBy": 'Mung',
                    "CreatedDate": new Date(),
                    "CreatedBy": 'Mung',
                    "Active": active
                }


                CommonService.UpdateData("MaterialInventories", postData, InventoryId).then(function (response) {
                    var isAlertDone = false;
                    if (response != undefined) {
                        // var selectedRows = $filter('filter')($scope.gridOptions.data, { IsSelected: true }, true);

                        if (!isAlertDone) {
                            toaster.pop('success', "", "Inventory Data Updated Successfully", 5000, 'trustedHtml');
                            isAlertDone = true;
                            $scope.DataSaved = true;
                            $location.path('/MaterialInventoryDashboard');
                        }

                    }
                });
            } catch (error) {
                console.log("Exception caught in the UpdateData material inventory function. Exception Logged as " + error.message);
            }

        }
        $scope.GetTotalQuantityNPending = function () {
            $scope.TotalQuantity = 0;
            $scope.TotalPending = 0;
            angular.forEach($scope.MaterialInventoryList, function (items) {
                if (items.AddTransfer == 'Add') {
                    $scope.TotalQuantity += parseFloat(items.Quantity);
                    if (items.PaymentStatus == 'Pending') {
                        $scope.TotalPending += parseFloat(items.Amount);
                    }
                }
            });

        };

        $scope.GetItemCategory = function () {
            var postData = {
                title: "ItemCategories",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            //$scope.showSpinner();
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.ItemCatogoryList = response.data.d.results;
                    //  console.log($scope.ItemCatogoryList);
                }

            });
        };
        $scope.GetMaterialsByCategoryId = function () {
            // $scope.showSpinner();
            $scope.subMaterialLists = $filter('filter')(GlobalVariableService.getMaterialList(), { ItemCategoryId: $scope.searchItemCategoryId }, true);
            // $scope.hideSpinner();
        };
        $scope.GetGodown = function () {
            //var GodownData = [];
            var lstItems = {
                title: "Godowns",
                fields: ["GodownId", "GodownName"],
                filter: ["Active eq 1"],
                orderBy: "GodownName"
            };
            //$scope.showSpinner();
            CommonService.GetListItems(lstItems).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.GodownData = response.data.d.results;
                }
                //return GodownData;
            });
        }
        $scope.GetSupplierRetailers = function () {
            var lstBill = {
                title: "SupplierRetailers",
                fields: ["SupplierRetailerId,Name,Category,Type"],
                //lookupFields: ["SupplierRetailer", "SaleCategory", "SaleType", "Status"],
                filter: ["Category eq " + CommonService.getCategory().Supplier],
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
            $location.path('/MaterialInventoryDashboard');
        };

        $scope.init = function () {

            GlobalVariableService.validateUrl($location.$$path);

            $scope.GetSupplierRetailers();
            $scope.GetGodown();
            $scope.GetDataForDashboard();
            $scope.GetItemCategory();
        };

        $scope.init();
    }]);