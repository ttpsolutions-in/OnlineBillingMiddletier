ETradersApp.controller("ManageRetailsController", ['GlobalVariableService', 'PrintService', '$scope', '$filter', '$q', '$http', '$location', '$routeParams',
    '$timeout', 'toaster', 'CommonService', 'uiGridConstants', 'uiGridValidateService', function (GlobalVariableService, PrintService, $scope, $filter, $q, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants, uiGridValidateService) {

        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.PageTitle = "Retail";
        $scope.BillNo = 0;
        $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.RetailData = {};
        $scope.RetailData.TotalAmount = 0;
        $scope.RetailData.GSTAmount = 0;
        $scope.RetailData.GrandAmount = 0;
        $scope.RetailData.GrandTotal = 0;
        $scope.RetailData.GSTPercentage = 0;
        $scope.RetailData.ContactNo = null;
        $scope.MaterialLists = [];
        $scope.MaterialsData = [];
        $scope.GodownData = [];
        $scope.SupplierCustomers = [];
        $scope.ItemCatogoryList = [];
        $scope.ItemLists = [];
        $scope.submitted = false;
        $scope.DataSaved = false;
        $scope.RetailData.GSTApplied = 0;
        $scope.RetailData.ShowGSTNo = 0;
        $scope.SaleType = 1;
        //$scope.SaleTypeCredit = 2;
        $scope.SaleCategoryRetail = 2;
        $scope.AdhocType = 2;
        $scope.BillStatus = {
            Active: 1,
            Cancelled: 2
        };
        $scope.IsDiscountApplied = 0;
        $scope.IsItemSelected = false;
        $scope.Category = {
            Supplier: 1,
            Customer: 2
        };


        $scope.gridOptions = {
            enableFiltering: false,
            enableCellEditOnFocus: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            enableColumnResizing: true,
            showColumnFooter: false,
            columnDefs: [
                {name: 'ID', field: 'ID', visible: false},
                {   name: 'ItemCategoryId', field: 'ItemCategoryId', visible: false},
                {
                    name: 'No', field: 'SrNo', width: 60, visible: true, enableFiltering: false,
                    enableSorting: true, headerCellClass: 'text-right', cellClass: 'text-center', displayName: 'Sl. No.', cellTemplate: '<span>{{rowRenderIndex+1}}</span>'
                },
                {   name: 'DisplayName', width: 300, displayName: 'Material', field: 'DisplayName', enableCellEdit: false},
                { displayName: 'Rate', width: 80, field: 'RetailRate', cellTooltip: true, enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Rate Unit', width: 80, field: 'UnitName', cellTooltip: true, enableCellEdit: false, headerCellClass: 'text-center' },
                {
                    displayName: 'Godown *', field: 'GodownId', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Quantity *', field: 'Quantity', type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true,
                    cellClass: function (grid, row) { return row.entity.Quantity < 0 ? 'text-right text-danger' : 'text-right'; },
                    editableCellTemplate: '<input type="number" min="1" required ui-grid-editor ng-model="MODEL_COL_FIELD"><div class="invalid-feedback">Value should be greater than zero.</div>',
                    headerCellClass: 'text-center'
                },
                //{ displayName: 'Discount', field: 'Discount', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ displayName: 'DLP', field: 'DLP', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ displayName: 'Discount Amt', field: 'Discount Amount', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Amount', field: 'Amount', type: 'number', aggregationType: uiGridConstants.aggregationTypes.sum, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'X', field: 'Action', cellTooltip: true, width: 50, cellClass: 'text-center', headerCellClass: 'text-center', cellTemplate: '<button style="line-height: 0.5;" class="btn btn-danger" ng-click="grid.appScope.Delete(row)"> X</button>' },
                {
                    name: 'MaterialId', field: 'MaterialId', visible: false
                }
            ],
            data: []

        };


        $scope.gridOptions.onRegisterApi = function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            /*
            gridApi.validate.on.validationFailed($scope, function (rowEntity, colDef, newValue, oldValue) {
                $window.alert('rowEntity: ' + rowEntity + '\n' +
                    'colDef: ' + colDef + '\n' +
                    'newValue: ' + newValue + '\n' +
                    'oldValue: ' + oldValue);
            });
            */
            //console.log($scope.gridApi)
            gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                //$scope.showSpinner();
                //var tempMateriallist = GlobalVariableService.getMaterialList();
                //$scope.currentMaterialLst = $filter('filter')(tempMateriallist, { ItemCategoryId: newRowCol.row.entity.ItemCategoryId }, true);
                //$scope.gridOptions.columnDefs[3].editDropdownOptionsArray = $scope.currentMaterialLst;//$filter('filter')($scope.currentMaterialLst, { ItemCategoryId: newRowCol.row.entity.ItemCategoryId }, true);
                $scope.gridOptions.columnDefs[6].editDropdownOptionsArray = $scope.GodownData;
                //$scope.hideSpinner();
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
                //rowEntity.RetailRate = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].RetailRate;
                //rowEntity.MaterialId = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].MaterialId;

                if (parseFloat(newValue) != parseFloat(oldValue)) {
                    $scope.DataSaved = false;

                    var result = CommonService.CalculateRowTotalAmount(rowEntity.RetailRate, rowEntity.Quantity, rowEntity.Discount, rowEntity.DLP);
                    rowEntity.Amount = result.Amount;
                    rowEntity.IsDiscountApplied = result.IsDiscountApplied;

                }
            });

        };

        $scope.GetGrandAmount = function () {
            $scope.RetailData.TotalAmount = 0;
            $scope.DataCorrect = true;
            angular.forEach($scope.ItemLists, function (items) {

                if ($scope.DataCorrect == true && (isNaN(parseFloat(items.Amount)) || parseFloat(items.Amount) < 1)) {
                    $scope.DataCorrect = false;
                }
                else
                    $scope.RetailData.TotalAmount = (parseFloat($scope.RetailData.TotalAmount) + parseFloat(items.Amount)).toFixed(2);
            });
            $scope.CalculateGST();

            return $scope.RetailData.TotalAmount;
        };


        $scope.Delete = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.gridOptions.data.splice(index, 1);
            $scope.GetGrandAmount();
        };

        $scope.CalculateGST = function () {

            //var paramdata = {};
            //paramdata.TotalAmount = $scope.RetailData.TotalAmount;
            //paramdata.GSTApplied = $scope.RetailData.GSTApplied;
            //paramdata.GSTPercentage = $scope.RetailData.GSTPercentage;
            var results = {};
            results = CommonService.CalculateGSTNGrandTotal($scope.RetailData.TotalAmount, $scope.RetailData.GSTPercentage, $scope.RetailData.GSTApplied);

            $scope.RetailData.GrandTotal = results.GrandTotal;
            $scope.RetailData.GSTAmount = results.GSTAmount;
        };

        $scope.GetContactNo = function () {
            if ($scope.RetailData.SupplierCustomer > 0) {
                $scope.RetailData.ContactNo = $filter('filter')($scope.SupplierCustomers, { SupplierRetailerId: $scope.RetailData.SupplierCustomer }, true)[0].Contact;
            } else {
                $scope.RetailData.ContactNo = "";
            }
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
            $scope.showSpinner();
            CommonService.getMaterials($scope.RetailData.ItemCategory).then(res => {
                $scope.currentMaterialLst = res;
            }).catch(error => { throw error; });
            //$scope.currentMaterialLst = $filter('filter')(GlobalVariableService.getMaterialList(), { ItemCategoryId: $scope.RetailData.ItemCategory }, true);
            $scope.hideSpinner();
        };
        $scope.GetGodowns = function (callback) {
            CommonService.GetGodowns().then(
                function (result) {
                    $scope.GodownData = result;
                    if (callback)
                        callback();
                });
        };
        $scope.GetGSTPercentageById = function () {
            var postData = {
                title: "GSTPercentages",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.RetailData.GSTPercentage = response.data.d.results[0].GST;
                }
            });
        };
        $scope.GetUnits = function () {
            var postData = {
                title: "Units",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.Units = response.data.d.results;
                }
            });
        };
        $scope.GetItemCategory = function (callback) {
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
                    if (callback)
                        callback()
                }

            });
        };


        $scope.GetSupplierCustomer = function (callback) {
            var postData = {
                title: "SupplierRetailers",
                fields: ["*"],
                filter: ["Category eq " + $scope.Category.Customer],
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierCustomers = response.data.d.results;
                    // console.log($scope.SupplierRetailers);
                    if (callback)
                        callback();
                }
            });
        };

        $scope.AddItem = function () {
            if ($scope.gridOptions.data.length >= 25) {
                toaster.pop('warning', "", "It has reached 25 items on this single bill.", 5000, 'trustedHtml');
                return;
            }
            var RetailRate = $filter('filter')($scope.currentMaterialLst, { MaterialId: $scope.currentMaterialId }, true)[0].RetailRate;
            if (RetailRate == 0)
                toaster.pop("warning", "", "Retail rate for this item is zero! Please update it first.", 5000, 'trustedHtml');
            else {
                if ($scope.RetailData.ItemCategory != undefined) {
                    var item = {

                        "MaterialId": $scope.currentMaterialId,
                        "ItemCategoryId": $scope.RetailData.ItemCategory,
                        "DisplayName": $filter('filter')($scope.currentMaterialLst, { MaterialId: $scope.currentMaterialId }, true)[0].DisplayName,
                        "RetailRate": RetailRate,
                        "UnitName": $filter('filter')($scope.currentMaterialLst, { MaterialId: $scope.currentMaterialId }, true)[0].Unit.UnitName,
                        "GodownId": "--Select Godown--",
                        "Quantity": 0,
                        "Discount": 0,
                        "DLP": 0,
                        "Amount": 0,
                        "Action": ""
                    };
                    $scope.ItemLists.push(item);
                    $scope.gridOptions.data = $scope.ItemLists;
                }
                else {
                    toaster.pop('error', "", "Please select Category", 5000, 'trustedHtml');
                }
            }
        };

        $scope.SubmitItems = function (isFormValid, callback) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;
                var count = $scope.gridOptions.data.length;
                var errorMessage = '';

                if (count == 0) {
                    toaster.pop('error', "", "No data to save", 5000, 'trustedHtml');
                    return;
                }
                else {
                    angular.forEach($scope.gridOptions.data, function (value, key) {
                        if (value.GodownId == undefined || value.GodownId == '--Select Godown--') {
                            errorMessage += "At row " + (key + 1) + ", Please select Godown";
                        }
                        else if (value.Quantity == undefined || value.Quantity == 0) {
                            errorMessage += "At row " + (key + 1) + ", Please enter quantity";
                        }

                    });
                    if (errorMessage.length > 0) {
                        toaster.pop("error", "", errorMessage, "7000", "trustedHtml");
                        return;
                    }
                    else {
                        $scope.submitted = true;
                        isValid = true;
                    }
                }

                if (isValid && $scope.DataCorrect) {
                    if ($scope.RetailData.Others != null && ($scope.RetailData.SupplierCustomer == "" || $scope.RetailData.SupplierCustomer == undefined)) {
                        var duplicate = $filter('filter')($scope.SupplierCustomers, { Name: $scope.RetailData.Others }, true);
                        if (duplicate.length > 0) {
                            toaster.pop("warning", "", "Customer already exists! Please select from existing customer.", 5000, "trustedHtml")
                            return;
                        }
                        else {
                            var supplierCustomers = {
                                "Name": $scope.RetailData.Others,
                                "Address": "NA",
                                "Email": "NA",
                                "Contact": $scope.RetailData.ContactNo,
                                "Type": $scope.AdhocType,
                                "Category": $scope.Category.Customer,
                                "CreatedOn": new Date()
                            };
                            $scope.SaveSupplierCustomers(supplierCustomers).then(function (CustomerID) {
                                $scope.CustomerId = CustomerID;
                                $scope.SaveBillDetails(callback);
                            });
                        }
                    } else {
                        $scope.CustomerId = $scope.RetailData.SupplierRetailer;
                        $scope.SaveBillDetails(callback);
                    }


                } else {
                    toaster.pop('error', "", "Please enter complete data", 5000, 'trustedHtml');
                }
            } catch (error) {
                console.log("Exception caught  in ManageWholeSaleController and SubmitItems function. Exception Logged as " + error.message);
            }
        };
        $scope.SaveNPrint = function (isFormValid) {
            $scope.SubmitItems(isFormValid, function () {
                PrintService.GetSingleBillNPrint($scope.BillNo);

            });
        }

        $scope.SaveSupplierCustomers = function (supplierCustomers) {
            try {
                var CustomerID = 0;
                var deferred = $q.defer();
                CommonService.PostData("SupplierRetailers", supplierCustomers).then(function (response) {
                    // console.log("response " + response);
                    if (response) {
                        CustomerID = parseInt(response.SupplierRetailerId);
                        deferred.resolve(CustomerID);
                    }
                }, function (data) {
                    //failure callback
                });
            } catch (error) {
                console.log("Exception caught in the SaveSupplierCustomers function. Exception Logged as " + error.message);
            }
            return deferred.promise;
        };


        $scope.SaveBillDetails = function (callback) {
            try {
                var saleType = 0;
                var billStatus = 0;
                var grandAmount = 0;
                var balanceAmount = 0;

                billStatus = $scope.BillStatus.Active;
                saleType = $scope.SaleType == true ? 1 : 0;

                var postData = {
                    "SaleDate": new Date(),
                    "RetailerId": $scope.CustomerId,
                    "SaleCategoryId": $scope.SaleCategoryRetail,
                    "SaleTypeId": saleType,
                    "GSTApplied": $scope.RetailData.GSTApplied,
                    "GSTAmount": $scope.RetailData.GSTAmount.toString(),
                    "GSTPercentage": $scope.RetailData.GSTPercentage.toString(),
                    "TotalAmount": $scope.RetailData.TotalAmount.toString(),
                    "GrandTotal": $scope.RetailData.GrandTotal.toString(),
                    "ShowGSTNo": $scope.RetailData.ShowGSTNo,
                    "DiscountApplied": $scope.IsDiscountApplied,
                    "BillStatus": billStatus,  //Cash --> complete, Credit--> pending
                    "PaidAmt": grandAmount.toString(), //Credit --> 0. cash --> GrandAmount
                    "BalanceAmt": balanceAmount.toString(), // Credit --> GrandAmount ,cash-->0
                    "CreatedBy": $scope.tokens.UserName.toString(),
                    "CreatedOn": new Date()
                };

                $scope.currentPostData = postData;
                //delete $scope.currentPostData.CreatedOn;
                //delete $scope.currentPostData.SaleDate;
                var difference;
                if ($scope.prePostData != undefined) {
                    difference = CommonService.compareJSON($scope.prePostData, $scope.currentPostData);
                }
                if (difference != null && difference.length > 0)
                    return;
                else {

                    $scope.prePostData = $scope.currentPostData;

                    CommonService.PostData("Bills", postData).then(function (response) {
                        if (response.BillNo > 0) {
                            $scope.BillNo = response.BillNo;
                            //  var selectedRows = $filter('filter')($scope.gridOptions.data, { IsSelected: true }, true);
                            var selectedRowsCount = $scope.gridOptions.data.length;
                            if (selectedRowsCount > 0) {
                                var isAlertDone = false;
                                angular.forEach($scope.gridOptions.data, function (value, key) {
                                    var salesPostDate = {
                                        "MaterialId": value.MaterialId,//$filter('filter')($scope.MaterialsData, { DisplayName: value.DisplayName }, true)[0].MaterialId,
                                        "Rate": value.RetailRate.toString(),
                                        "GodownId": $filter('filter')($scope.GodownData, { GodownName: value.GodownId }, true)[0].GodownId,
                                        "Quantity": value.Quantity.toString(),
                                        "Discount": value.Discount.toString(),
                                        "DLP": value.DLP.toString(),
                                        "Amount": value.Amount.toString(),
                                        "BillNo": response.BillNo.toString(),
                                        "CreatedOn": new Date(),
                                        "StatusId": 1,
                                        "ItemCategoryId": value.ItemCategoryId
                                    };
                                    CommonService.PostData("Sales", salesPostDate).then(function (response1) {
                                        if (response1.SaleId > 0) {
                                            if (!isAlertDone) {
                                                toaster.pop('success', "", "Retails Data Saved Successfully", 5000, 'trustedHtml');
                                                isAlertDone = true;
                                                $scope.DataSaved = true;
                                                callback();
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            } catch (error) {
                console.log("Exception caught in the  function. Exception Logged as " + error.message);
            }
        };

        $scope.init = async function () {
            //$scope.showSpinner();
            GlobalVariableService.validateUrl($location.$$path);
            $scope.tokens = GlobalVariableService.getTokenInfo();
            await $scope.GetItemCategory();
            await $scope.GetSupplierCustomer();
            await $scope.GetGodowns();
            await $scope.GetGSTPercentageById();

            //$scope.GetItemCategory(function () {
            //    $scope.GetSupplierCustomer(function () {
            //        $scope.GetGodowns(function () {
            //            $scope.GetGSTPercentageById();
            //        });
            //    });
            //});
        };

        $scope.init();
    }]);