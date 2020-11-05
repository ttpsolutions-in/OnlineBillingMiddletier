ETradersApp.controller("MaterialInventoryController", ['$scope', '$filter', '$q', '$http', '$location', '$routeParams', '$timeout', 'toaster',
    'CommonService', 'uiGridConstants', 'uiGridValidateService', 'GlobalVariableService', function ($scope, $filter, $q, $http, $location, $routeParams,
        $timeout, toaster, CommonService, uiGridConstants, uiGridValidateService, GlobalVariableService) {

        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.PageTitle = "Material Inventory";
        $scope.BillNo = 0;
        $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.MaterialInventoryData = {};

        $scope.MaterialsData = [];
        $scope.GodownData = {};
        $scope.SupplierCustomers = [];
        $scope.ItemCatogoryList = [];
        $scope.ItemCategoryId = null;
        $scope.submitted = false;
        $scope.ItemLists = [];
        $scope.Category = {
            Supplier: 1,
            Customer: 2
        };
        $scope.AddRemove = [{
            type: "Add"
        },
        {
            type: "Transfer"
        }]

        $scope.gridOptions = {
            enableFiltering: false,
            enableCellEditOnFocus: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            enableColumnResizing: true,
            showColumnFooter: false,
            columnDefs: [
                {
                    name: 'ID', field: 'InventoryId', visible: false
                },
                {
                    field: 'DisplayName', width:250, displayName: 'Material', editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownValueLabel: 'DisplayName', editDropdownIdLabel: 'DisplayName'
                },
                {
                    displayName: 'Quantity', field: 'Quantity', type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true,
                    cellClass: function (grid, row) { return row.entity.Quantity < 0 ? 'text-right text-danger' : 'text-right'; },
                    editableCellTemplate: '<input type="number" min="1" required ui-grid-editor ng-model="MODEL_COL_FIELD"><div class="invalid-feedback">Value should be greater than zero.</div>',
                    headerCellClass: 'text-center'
                },
                {
                    displayName: 'QPU', field: 'QuantityPerUnit', type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true,
                    cellClass: function (grid, row) { return row.entity.Quantity < 0 ? 'text-right text-danger' : 'text-right'; },
                    editableCellTemplate: '<input type="number" min="1" required ui-grid-editor ng-model="MODEL_COL_FIELD"><div class="invalid-feedback">Value should be greater than zero.</div>',
                    headerCellClass: 'text-center'
                },
                {
                    displayName: 'Amount', field: 'Amount', type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true,
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
                    displayName: 'Payment Status', field: 'PaymentStatus', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center',
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'type', editDropdownIdLabel: 'type'
                },
                {
                    displayName: 'Add Transfer', field: 'AddTransfer', enableCellEdit: true, cellTooltip: true, headerCellClass: 'text-center',
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'type', editDropdownIdLabel: 'type'
                },
                {
                    displayName: 'Godown', field: 'GodownId', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Transfer To', field: 'TransferToGodown', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                { displayName: 'Comments', field: 'Comments', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'X', field: 'Action', cellTooltip: true, width: 50, cellClass: 'text-center', headerCellClass: 'text-center', cellTemplate: '<button style="line-height: 0.5;" class="btn btn-danger" ng-click="grid.appScope.Delete(row)"> X</button>' },

                {
                    name: 'StoreGodownId', field: 'StoreGodownId', visible: false
                },
                {
                    name: 'StoreSupplierId', field: 'StoreSupplierId', visible: false
                },
                {
                    name: 'StoreTransferToGodownId', field: 'StoreTransferToGodownId', visible: false
                },
                {
                    name: 'MaterialId', field: 'MaterialId', visible: false
                },
                {
                    name: 'MaterialCategoryId', field: 'MaterialCategoryId', visible: false
                }
            ],
            data: []

        };


        $scope.gridOptions.onRegisterApi = function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;

            gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                var CategoryId = 0;
                                
                switch (newRowCol.col.field) {
                    case "DisplayName":                       
                        var tempMateriallist = GlobalVariableService.getMaterialList();
                        $scope.currentMaterialLst = $filter('filter')(tempMateriallist, { ItemCategoryId: $scope.ItemCategoryId }, true);
                        $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = $scope.currentMaterialLst;
                            break;                    
                    case "SupplierId":
                        $scope.gridOptions.columnDefs[4].editDropdownOptionsArray = $scope.SupplierCustomers;
                        break;
                    case "PaymentStatus":
                        $scope.gridOptions.columnDefs[5].editDropdownOptionsArray = CommonService.getPaymentStatus();
                        break;
                    case "AddTransfer":
                        $scope.gridOptions.columnDefs[6].editDropdownOptionsArray = CommonService.getAddTransfer();
                        break;
                    case "GodownId":
                        $scope.gridOptions.columnDefs[7].editDropdownOptionsArray = $scope.GodownData;
                        break;
                    case "TransferToGodown":
                        $scope.gridOptions.columnDefs[8].editDropdownOptionsArray = $scope.GodownData;
                        break;
                }
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
                
                if (parseFloat(newValue) != parseFloat(oldValue)) {
                    switch (colDef.field) {
                        case "Quantity":
                            rowEntity.Quantity = rowEntity.Quantity == null ? 0 : rowEntity.Quantity;
                            break;
                        case "DisplayName":
                            rowEntity.MaterialId = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].MaterialId;
                            rowEntity.MaterialCategoryId = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].ItemCategoryId;
                            break;
                        case "GodownId":
                            rowEntity.StoreGodownId = $filter('filter')($scope.GodownData, { GodownName: rowEntity.GodownName }, true)[0].GodownId;
                            break;
                        case "TransferToGodown":
                            rowEntity.StoreTransferToGodownId = $filter('filter')($scope.GodownData, { GodownName: rowEntity.TransferToGodown }, true)[0].GodownId;
                            break;
                        case "SupplierId":
                            rowEntity.StoreSupplierId = $filter('filter')($scope.SupplierCustomers, { Name: rowEntity.SupplierId }, true)[0].SupplierRetailerId;
                            break;
                    }
                }
            });
        };

        $scope.Delete = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.gridOptions.data.splice(index, 1);
        };

        $scope.GetMaterials = function () {
            var lstItems = {
                title: "Materials",
                fields: ["MaterialId", "DisplayName", "RetailRate", "ItemCategoryId", "ItemCategory/ItemCategoryId"],
                lookupFields: ["ItemCategory"],
                orderBy: "DisplayName desc"
            };
            //$scope.showSpinner();
            CommonService.GetListItems(lstItems).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.MaterialsData = response.data.d.results;

                }
            });
        };

        $scope.GetMaterialsByCategoryId = function () {

            $scope.MaterialLists = $filter('filter')($scope.MaterialsData, { ItemCategoryId: $scope.ItemCategoryId }, true);

        };
        $scope.GetGodowns = function () {
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


        $scope.GetSupplierCustomer = function () {
            var postData = {
                title: "SupplierRetailers",
                fields: ["*"],
                filter: ["Category eq " + $scope.Category.Supplier],
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierCustomers = response.data.d.results;
                    // console.log($scope.SupplierRetailers);

                }
            });
        };


        $scope.AddItem = function () {
            $scope.addItem = true;
            if ($scope.ItemCategoryId != undefined) {
                var item = {

                    "MaterialId": 0,
                    "DisplayName": '--Select material--',
                    "GodownId": '--Select godown--',
                    "Quantity": 1,
                    "QuantityPerUnit":0,
                    "Amount":0,
                    "SupplierId": '--Select supplier--',
                    "Payment Status": "--Select status--",
                    "AddTransfer": '--Select type--',
                    "TransferToGodown": '--Select godown--',
                    "Comments": "",
                    "Action": ""
                };
                $scope.ItemLists.push(item);
                $scope.gridOptions.data = $scope.ItemLists;
            }

        };


        $scope.SubmitItems = function (isFormValid) {
            try {
                var isValid = isFormValid;
                var errorMessage = '';
                $scope.submitted = !isValid;
                if (isValid) {
                    if ($scope.gridOptions.data.length == 0) {
                        toaster.pop("error", "", "No data to save!", 7000, 'trustedHtml')
                        //$scope.submitted = false;
                    }
                    else {



                        angular.forEach($scope.gridOptions.data, function (value, key) {
                            var row = 'At row ' + parseInt(key + 1) + ', '
                            errorMessage = '';
                            if (value.MaterialId == 0)
                                errorMessage = "Please select material.<br/>";
                            if (value.PaymentStatus == undefined)
                                errorMessage += "Payment Status should be selected.<br/>";
                            if (value.StoreSupplierId == undefined)
                                errorMessage += "Supplier should be selected.<br/>";
                            if (value.GodownId == value.TransferToGodown && value.AddTransfer == 'Transfer')
                                errorMessage += "In row no. " + (key + 1) + ", Godown transfer from and to can not be same.<br/>"
                            if (value.Quantity < 1)
                                errorMessage += "Quantity can not be less than 1."
                            if (errorMessage.length > 0) {
                                toaster.pop('warning', "", row + errorMessage, 7000, 'trustedHtml');
                                return
                            }
                            var MaterialInventoryData = {
                                "MaterialId": value.MaterialId,//$filter('filter')($scope.MaterialsData, { DisplayName: value.DisplayName }, true)[0].MaterialId,
                                "Amount": value.Amount.toString(),
                                "PaymentStatus": value.PaymentStatus.toString(),
                                "GodownId": value.StoreGodownId,
                                "SupplierId": value.StoreSupplierId,
                                "Quantity": value.Quantity.toString(),
                                "QuantityPerUnit": value.QuantityPerUnit.toString(),
                                "AddTransfer": value.AddTransfer.toString(),
                                "TransferToGodown": value.StoreTransferToGodownId,
                                "Comments": value.Comments.toString(),
                                "CreatedBy": $scope.tokens.UserName.toString(),
                                "UpdatedBy": $scope.tokens.UserName.toString(),
                                "CreatedDate": new Date(),
                                "UpdatedDate": new Date(),
                                "Active": 1
                            }
                            $scope.SaveMaterialInventory(MaterialInventoryData);
                        });
                    }

                } else if (!$scope.IsItemSelected && isValid) {
                    toaster.pop('warning', "", "Please enter all mandatory data", 5000, 'trustedHtml');
                }

            } catch (error) {
                console.log("Exception caught in ManageWholeSaleController and SubmitItems function. Exception Logged as " + error.message);
            }
        };

        $scope.SaveMaterialInventory = function (supplierCustomers) {
            try {
                var CustomerID = 0;
                var deferred = $q.defer();
                CommonService.PostData("MaterialInventories", supplierCustomers).then(function (response) {
                    // console.log("response " + response);
                    if (response) {
                        CustomerID = parseInt(response.SupplierRetailerId);
                        deferred.resolve(CustomerID);
                        toaster.pop('success', "", "Inventory Data Saved Successfully", 5000, 'trustedHtml');
                        $location.path("/MaterialInventoryDashboard");
                    }
                }, function (data) {
                    //failure callback
                });
            } catch (error) {
                console.log("Exception caught in the SaveMaterialInventory function. Exception Logged as " + error.message);
            }
            return deferred.promise;
        };

        $scope.init = function () {

            $scope.tokens = GlobalVariableService.getTokenInfo();
            GlobalVariableService.validateUrl($location.$$path);
            $scope.tokens = GlobalVariableService.getTokenInfo();
            $scope.GetItemCategory();
            $scope.GetSupplierCustomer();
            $scope.GetGodowns();
        };

        $scope.init();
    }]);