ETradersApp.controller("ManageWholeSaleController", ['GlobalVariableService', 'PrintService', '$scope', '$filter', '$q', '$http', '$location', '$routeParams', '$timeout',
    'toaster', 'CommonService', 'uiGridConstants', function (GlobalVariableService, PrintService, $scope, $filter, $q, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants) {

        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }

        $scope.PageTitle = "Whole Sale";
        $scope.BillNo = 0;
        $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.WholeSale = {};
        $scope.WholeSale.TotalAmount = 0;
        $scope.WholeSale.GSTAmount = 0;
        $scope.WholeSale.GrandAmount = 0;
        $scope.WholeSale.GSTPercentage = 0;
        $scope.WholeSale.ShowGSTNo = 0;
        $scope.WholeSale.ContactNo = null;
        //$scope.MaterialLists = [];
        $scope.MaterialsData = [];
        $scope.SupplierRetailers = [];
        $scope.ItemCatogoryList = [];
        $scope.ItemLists = [];
        $scope.submitted = false;
        $scope.WholeSale.GSTApplied = 0;
        $scope.SaleTypeCash = 1;
        $scope.SaleTypeCredit = 2;
        $scope.SaleCategoryWholeSale = 1;
        $scope.AdhocType = 2;

        $scope.BillStatus = {
            Active: 1,
            Cancelled: 2
        };
        $scope.IsDiscountApplied = 0;
        $scope.IsItemSelected = false;
        $scope.Category = {
            Supplier: 1,
            Retailer: 2
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
                {
                    name: 'ID', field: 'ID', visible: false
                },
                {
                    name: 'ItemCategoryId', field: 'ItemCategoryId', visible: false
                },
                {
                    name: 'No', field: 'SrNo', width: 80, visible: true, enableFiltering: false, enableSorting: true,
                    headerCellClass: 'text-right', cellClass: 'text-center', displayName: 'Sl. No', cellTemplate: '<span>{{rowRenderIndex+1}}</span>'
                },
                {
                    name: 'DisplayName', width: 300, displayName: 'Particulars', editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownValueLabel: 'DisplayName', editDropdownIdLabel: 'DisplayName'
                },
                {
                    displayName: 'Rate', width: 100, field: 'WholeSaleRate', type: 'number', cellTooltip: true,
                    enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Godown', field: 'GodownId', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                { displayName: 'Quantity', width: 100, field: 'Quantity', type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Discount', field: 'Discount', type: 'number', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'DLP', field: 'DLP', type: 'number', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ displayName: 'Discount Amt', field: 'Discount Amount', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Amount', field: 'Amount', type: 'number', aggregationType: uiGridConstants.aggregationTypes.sum, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'X', field: 'Action', cellTooltip: true, width: 50, cellClass: 'text-center', headerCellClass: 'text-center', cellTemplate: '<button style="line-height: 0.5;" class="btn btn-danger" ng-click="grid.appScope.Delete(row)"> X</button>' },
                { name: 'MaterialId', field: 'MaterialId', visible: false }
            ],
            data: []

        };


        $scope.gridOptions.onRegisterApi = function (gridApi) {

            //set gridApi on scope

            $scope.gridApi = gridApi;
            console.log($scope.gridApi)
            gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                //$scope.showSpinner();
                $scope.currentMaterialLst = $filter('filter')(GlobalVariableService.getMaterialList(), { ItemCategoryId: newRowCol.row.entity.ItemCategoryId }, true);
                $scope.gridOptions.columnDefs[3].editDropdownOptionsArray = $scope.currentMaterialLst;//$filter('filter')($scope.MaterialsData, { ItemCategoryId: newRowCol.row.entity.ItemCategoryId }, true);
                $scope.gridOptions.columnDefs[5].editDropdownOptionsArray = $scope.GodownData;
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
                rowEntity.WholeSaleRate = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].WholeSaleRate;
                rowEntity.MaterialId = $filter('filter')($scope.currentMaterialLst, { DisplayName: rowEntity.DisplayName }, true)[0].MaterialId;
                if (parseFloat(newValue) != parseFloat(oldValue)) {
                    rowEntity.DLP = rowEntity.DLP == null ? 0 : rowEntity.DLP;
                    rowEntity.Discount = rowEntity.Discount == null ? 0 : rowEntity.Discount;
                    var result = CommonService.CalculateRowTotalAmount(rowEntity.WholeSaleRate, rowEntity.Quantity, rowEntity.Discount, rowEntity.DLP);
                    rowEntity.Amount = result.Amount;
                    rowEntity.IsDiscountApplied = result.IsDiscountApplied;

                }
            });

        };

        $scope.GetGrandAmount = function () {
            $scope.WholeSale.TotalAmount = 0;
            angular.forEach($scope.ItemLists, function (items) {
                $scope.WholeSale.TotalAmount = $scope.WholeSale.TotalAmount + items.Amount;
            });

            $scope.CalculateGST();

            return parseFloat($scope.WholeSale.TotalAmount).toFixed(2);
        };


        $scope.Delete = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.gridOptions.data.splice(index, 1);
        };

        $scope.CalculateGST = function () {
            var paramdata = {};
            paramdata.TotalAmount = $scope.WholeSale.TotalAmount;
            paramdata.GSTApplied = $scope.WholeSale.GSTApplied;
            paramdata.GSTPercentage = $scope.WholeSale.GSTPercentage;
            var results = {};
            results = CommonService.CalculateGSTNGrandTotal(paramdata);

            $scope.WholeSale.GrandTotal = results.GrandTotal;
            $scope.WholeSale.GSTAmount = results.GSTAmount;

        };

        $scope.GetContactNo = function () {
            if ($scope.WholeSale.SupplierRetailer > 0) {
                $scope.WholeSale.ContactNo = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale.SupplierRetailer }, true)[0].Contact;
            } else {
                $scope.WholeSale.ContactNo = "";
            }
        };

        $scope.GetMaterialsByCategoryId = function () {
            //$scope.showSpinner();
            $scope.MaterialLists = $filter('filter')($scope.MaterialsData, { ItemCategoryId: $scope.WholeSale.ItemCategory }, true);
            //$scope.hideSpinner();
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
        $scope.GetGSTPercentageById = function () {
            var postData = {
                title: "GSTPercentages",
                fields: ["*"],
                filter: ["Id eq 1"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.WholeSale.GSTPercentage = response.data.d.results[0].GST;
                }
            });
        };

        $scope.GetItemCategory = function () {
            var postData = {
                title: "ItemCategories",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.ItemCatogoryList = response.data.d.results;
                    //console.log($scope.ItemCatogoryList);

                }
            });
        };


        $scope.GetSupplierRetailer = function () {
            var postData = {
                title: "SupplierRetailers",
                fields: ["*"],
                filter: ["Category eq " + $scope.Category.Retailer],
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierRetailers = response.data.d.results;
                    //console.log($scope.SupplierRetailers);
                    //callback();
                }
            });
        };


        $scope.AddItem = function () {
            if ($scope.WholeSale.ItemCategory != undefined) {
                //$scope.currentMaterialLst = $filter('filter')(GlobalVariableService.getMaterialList(), { ItemCategoryId: $scope.WholeSale.ItemCategory }, true);

                var item = {

                    "MaterialId": 0,
                    "ItemCategoryId": $scope.WholeSale.ItemCategory,
                    "DisplayName": '-- Select Material --',//$scope.currentMaterialLst[0].DisplayName,
                    "GodownId": $scope.GodownData[0].GodownName,
                    "Descriptioin": null,
                    "Whole_Sale_Rate": 0,
                    "Quantity": 0,
                    "Discount": 0,
                    "DLP": 0,
                    "Amount": 0,
                    "Action": ""
                };
                $scope.ItemLists.push(item);
                $scope.gridOptions.data = $scope.ItemLists;
            }

        };


        $scope.SubmitItems = function (isFormValid, callback) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;
                if (isValid) {
                    if ($scope.WholeSale.Others != null && ($scope.WholeSale.SupplierRetailer == "" || $scope.WholeSale.SupplierRetailer == undefined)) {
                        var supplierRetailers = {
                            "Name": $scope.WholeSale.Others,
                            "Address": "NA",
                            "Email": "NA",
                            "Contact": $scope.WholeSale.ContactNo,
                            "Type": $scope.AdhocType,
                            "Category": $scope.Category.Retailer,
                            "CreatedOn": new Date()
                        };
                        $scope.SaveSupplierRetailers(supplierRetailers).then(function (retailerID) {
                            $scope.RetailerId = retailerID;
                            $scope.SaveBillDetails(callback);
                            //callback();
                        });

                    } else {
                        $scope.RetailerId = $scope.WholeSale.SupplierRetailer;
                        $scope.SaveBillDetails(callback);
                        //callback();
                    }


                    $location.path('/');

                } else if (!$scope.IsItemSelected && isValid) {
                    toster.pop('warning', "", "Please select Items for submit", 5000, 'trustedHtml');
                }
            } catch (error) {
                console.log("Exception caught  in ManageWholeSaleController and SubmitItems function. Exception Logged as " + error.message);
            }
        };

        $scope.SaveSupplierRetailers = function (supplierRetailers) {
            try {
                var retailerID = 0;
                var deferred = $q.defer();
                CommonService.PostData("SupplierRetailers", supplierRetailers).then(function (response) {
                    console.log("response " + response);
                    if (response) {
                        retailerID = parseInt(response.SupplierRetailerId);
                        deferred.resolve(retailerID);
                    }
                }, function (data) {
                    //failure callback
                });
            } catch (error) {
                console.log("Exception caught in the SaveSupplierRetailers function. Exception Logged as " + error.message);
            }
            return deferred.promise;
        };


        $scope.SaveBillDetails = function (callback) {
            try {
                var saleType = 0;
                var billStatus = 0;
                var GrandTotal = 0;
                var balanceAmount = 0;
                //Cash
                if ($scope.WholeSale.SaleTypeCash) {
                    saleType = $scope.SaleTypeCash;
                    billStatus = $scope.BillStatus.Active;
                    //GrandTotal = $scope.WholeSale.GrandTotal;
                    balanceAmount = 0;
                } else {
                    //Credit
                    saleType = $scope.SaleTypeCredit;
                    billStatus = $scope.BillStatus.Active;
                    //GrandTotal = $scope.WholeSale.GrandTotal;
                    balanceAmount = $scope.WholeSale.GrandTotal;
                }
                var postData = {
                    "SaleDate": new Date(),
                    "RetailerId": $scope.RetailerId,
                    "SaleCategoryId": $scope.SaleCategoryWholeSale,
                    "SaleTypeId": saleType,
                    "GSTApplied": $scope.WholeSale.GSTApplied,
                    "GSTAmount": $scope.WholeSale.GSTAmount.toString(),
                    "GSTPercentage": parseFloat($scope.WholeSale.GSTPercentage).toFixed(2),
                    "TotalAmount": parseFloat($scope.WholeSale.TotalAmount).toFixed(2),
                    "GrandTotal": $scope.WholeSale.GrandTotal,
                    "ShowGSTNo": $scope.WholeSale.ShowGSTNo,
                    "DiscountApplied": $scope.IsDiscountApplied,
                    "BillStatus": billStatus,//Cash --> complete, Credit--> pending
                    "PaidAmt": balanceAmount.toString(), //Credit --> 0. cash --> GrandAmount
                    "BalanceAmt": balanceAmount.toString() // Credit --> GrandAmount ,cash-->0
                };
                CommonService.PostData("Bills", postData).then(function (response) {
                    if (response.BillNo > 0) {
                        $scope.BillNo = response.BillNo;
                        // var selectedRows = $filter('filter')($scope.gridOptions.data, { IsSelected: true }, true);
                        var selectedRowsCount = $scope.gridOptions.data.length;
                        if (selectedRowsCount > 0) {
                            var isAlertDone = false;
                            angular.forEach($scope.gridOptions.data, function (value, key) {
                                var salesPostDate = {
                                    "MaterialId": value.MaterialId,//$filter('filter')($scope.MaterialsData, { DisplayName: value.DisplayName }, true)[0].MaterialId,
                                    "Quantity": value.Quantity.toString(),
                                    "Discount": value.Discount.toString(),
                                    "DLP": value.DLP.toString(),
                                    "Amount": value.Amount.toString(),
                                    "BillNo": response.BillNo,
                                    "GodownId": $filter('filter')($scope.GodownData, { GodownName: value.GodownId }, true)[0].GodownId,
                                    "CreatedOn": new Date()
                                };
                                CommonService.PostData("Sales", salesPostDate).then(function (response1) {
                                    if (response1.SaleId > 0) {
                                        if (!isAlertDone) {
                                            //$scope.BillNo = response1.SaleId;
                                            //$scope.GetWholeSaleByID(response.BillNo);
                                            toaster.pop('success', "", "Data saved successfully", 5000, 'trustedHtml');
                                            isAlertDone = true;
                                            callback();
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            } catch (error) {
                console.log("Exception caught in the Whole sale data save function. Exception Logged as " + error.message);
            }
        };
        $scope.SaveNPrint = function (isFormValid) {
            $scope.SubmitItems(isFormValid, function () {
                PrintService.GetWholeSaleByID($scope.BillNo);
                $location.path('/');
            });
        }

        $scope.GetWholeSaleByID = function (saleId) {
            try {
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
                        "Bill/GSTPercentage",
                        "Bill/GSTAmount",
                        "Bill/TotalAmount",
                        "Bill/GrandTotal",
                        "Bill/SaleTypeId",
                        "Bill/SaleCategoryId",
                        "Bill/ShowGSTNo",
                        "Material",
                        "Material/WholeSaleRate",
                        "Material/RetailRate"
                    ],
                    lookupFields: ["Bill", "Material"],
                    filter: ["BillNo eq " + saleId],
                    //limitTo: "5000",
                    orderBy: "CreatedOn desc"
                };

                CommonService.GetListItems(lstBill).then(function (response) {
                    if (response && response.data.d.results.length > 0) {
                        $scope.printWholeSale = response.data.d.results;

                        $scope.printWholeSale.TotalAmount = 0;
                        $scope.printWholeSale[0].Bill.Contact = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.printWholeSale[0].Bill.RetailerId }, true)[0].Contact;
                        $scope.printWholeSale[0].Bill.Name = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.printWholeSale[0].Bill.RetailerId }, true)[0].Name;
                        angular.forEach($scope.printWholeSale, function (value) {
                            var rate = 0;
                            if (value.Bill.SaleCategoryId == 1) {
                                rate = value.Material.WholeSaleRate * value.Quantity;
                                value.Rate = value.Material.WholeSaleRate;
                            } else {
                                rate = value.Material.RetailRate * value.Quantity;
                                value.Rate = value.Material.RetailRate;
                            }
                        });
                        /*   var amount = 0;
                           var discountAmt = 0;
                           if (value.Discount > 0) {
                               discountAmt = rate / 100 * parseFloat(value.Discount);
                               amount = parseFloat(rate) - parseFloat(discountAmt);
                           } else {
                               amount = rate;
                           }
                           value.TotalAmount = amount - parseFloat(value.DLP);
                           $scope.printWholeSale.TotalAmount = $scope.printWholeSale.TotalAmount + parseFloat(value.TotalAmount);
                           if (value.Bill.GSTApplied > 0) {
                               $scope.printWholeSale.GSTAmount = $scope.printWholeSale.TotalAmount * $scope.WholeSale.GSTPercentage / 100;
                           } else {
                               $scope.printWholeSale.GSTAmount = 0;
                           }
                           */
                        $scope.printBill();

                        //});
                    }
                });
            } catch (error) {
                console.log("Exception caught in the getSalebyId function. Exception Logged as " + error.message);
            }
        };

        $scope.RedirectDashboard = function () {
            $location.path('/WholeSaleDashboardController');
        };
        $scope.init = function () {
            //$scope.showSpinner();
            $scope.GetItemCategory();
            $scope.GetSupplierRetailer();
            $scope.GetGodowns();
            $scope.GetGSTPercentageById();
        };

        $scope.init();
    }]);