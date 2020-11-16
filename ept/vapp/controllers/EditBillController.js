ETradersApp.controller("EditBillController", ['$mdDialog', '$scope', '$filter', '$q', '$http', '$location', '$routeParams', '$timeout', 'toaster',
    'GlobalVariableService', 'CommonService', 'uiGridConstants', 'PrintService', function ($mdDialog, $scope, $filter, $q, $http, $location, $routeParams, $timeout,
        toaster, GlobalVariableService, CommonService, uiGridConstants, PrintService) {

        $scope.tokenInfo = {};


        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.DataCorrect = true;
        $scope.RightsText = {
            "CancelBill": "CancelBill"
        }
        $scope.PageTitle = "Edit Bill";
        $scope.ID = $routeParams.ID;
        $scope.BillNo = $routeParams.ID;
        $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.WholeSale = {};
        $scope.WholeSale.TotalAmount = 0;
        $scope.WholeSale.GSTAmount = 0;
        $scope.WholeSale.GrandAmount = 0;
        $scope.WholeSale.GSTPercentage = 0;
        $scope.WholeSale.ContactNo = null;
        $scope.WholeSale.Quantity = 0;
        $scope.WholeSale.Rate = 0;
        $scope.WholeSale.Amount = 0;
        $scope.MaterialLists = [];
        $scope.currentMaterialLst = [];
        $scope.SupplierRetailers = [];
        $scope.ItemCatogoryList = [];
        $scope.ItemLists = [];
        $scope.submitted = false;
        $scope.DataSaved = true;
        $scope.WholeSale.GSTApplied = 0;
        $scope.UpdateWithCurrentGST = 0;
        $scope.SaleTypeCash = 1;
        $scope.SaleTypeCredit = 2;
        $scope.SaleCategoryWholeSale = 1;
        $scope.AdhocType = 2;
        $scope.GSTPercentage = 0;
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
        $scope.DeletedRows = [];

        $scope.gridOptions = {
            enableFiltering: false,
            enableCellEditOnFocus: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            enableColumnResizing: true,
            showColumnFooter: false,
            enableVerticalScrollbar: 1,
            columnDefs: [
                {
                    name: 'ID', field: 'ID', visible: false
                },
                {
                    name: 'ItemCategoryId', field: 'ItemCategoryId', visible: false
                },
                {
                    name: 'No', field: 'SrNo', width: 60, visible: true, enableFiltering: false, enableSorting: true,
                    headerCellClass: 'text-right', cellClass: 'text-center', displayName: 'Sl. No', cellTemplate: '<span>{{rowRenderIndex+1}}</span>'
                },
                {
                    name: 'DisplayName', displayName: 'Material', field: 'DisplayName', enableCellEdit: false
                },
                { displayName: 'Rate', field: 'Rate', type: 'number', cellTooltip: true, enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center' },
                {
                    displayName: 'Godown', field: 'Godown.GodownName', cellTooltip: true, enableCellEdit: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'GodownName', editDropdownIdLabel: 'GodownName',
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                { displayName: 'Quantity', field: 'Quantity', type: 'number', enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{
                //    displayName: 'Status', field: 'Status.StatusName', cellTooltip: true, enableCellEdit: true,
                //    editableCellTemplate: 'ui-grid/dropdownEditor', editDropdownValueLabel: 'StatusName', editDropdownIdLabel: 'StatusName',
                //    cellClass: 'text-left', headerCellClass: 'text-center'
                //},
                { displayName: 'Discount', field: 'Discount', type: 'number', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'DLP', field: 'DLP', type: 'number', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Amount', field: 'Amount', type: 'number', aggregationType: uiGridConstants.aggregationTypes.sum, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                
                { displayName: 'SaleId', visible: false, field: 'SaleId', type: 'number', enableCellEdit: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'X', field: 'Action', cellTooltip: true, width: 50, cellClass: 'text-center', headerCellClass: 'text-center', cellTemplate: '<button style="line-height: 0.5;" class="btn btn-danger" ng-click="grid.appScope.Delete(row)"> X</button>' },

                {
                    name: 'MaterialId', field: 'MaterialId', visible: false
                }],
            data: []

        };


        $scope.gridOptions.onRegisterApi = function (gridApi) {

            //set gridApi on scope

            $scope.gridApi = gridApi;
            //   console.log($scope.gridApi)
            gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                $scope.gridOptions.columnDefs[5].editDropdownOptionsArray = $scope.GodownData;
               // $scope.gridOptions.columnDefs[7].editDropdownOptionsArray = $scope.StatusList;
                $scope.hideSpinner();
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
                    $scope.DataSaved = false;

                    var result = CommonService.CalculateRowTotalAmount(rowEntity.Rate, rowEntity.Quantity, rowEntity.Discount, rowEntity.DLP);
                    rowEntity.Amount = result.Amount;
                    rowEntity.IsDiscountApplied = result.IsDiscountApplied;
                }
                $scope.GetGrandAmount();
            });

        };
        $scope.dataChanged = function () {
            $scope.DataSaved = false;
        }
        $scope.GetGrandAmount = function () {
            $scope.WholeSale.TotalAmount = 0;
            $scope.DataCorrect = true;
            if ($scope.WholeSale.length > 0) {
                angular.forEach($scope.WholeSale, function (items) {
                    
                    //if (items.Status.StatusName =="Active")
                    //{
                        if ($scope.DataCorrect == true && (isNaN(parseFloat(items.Amount)) || parseFloat(items.Amount) < 1)) {
                            $scope.DataCorrect = false;
                        }
                        else
                            $scope.WholeSale.TotalAmount = (parseFloat($scope.WholeSale.TotalAmount) + parseFloat(items.Amount)).toFixed(2);
                   // }
                });
            }

            $scope.CalculateGST();

            return $scope.WholeSale.TotalAmount;
        };


        $scope.Delete = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.DeletedRows.push(row.entity);
            $scope.gridOptions.data.splice(index, 1);
            $scope.GetGrandAmount();
        };
        $scope.showConfirm = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .textContent('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Sounds like a scam');

            $mdDialog.show(confirm).then(function () {
                $scope.status = 'You decided to get rid of your debt.';
            }, function () {
                $scope.status = 'You decided to keep your debt.';
            });
        };

        $scope.CalculateGST = function () {

            var results = {};
            if ($scope.UpdateWithCurrentGST == 1) {
                $scope.applicableGST = $scope.GSTPercentage.toFixed(2);
                $scope.WholeSale.GSTApplied = 1;
            }
            else {
                $scope.applicableGST = $scope.WholeSale.GSTPercentage;
            }

            results = CommonService.CalculateGSTNGrandTotal($scope.WholeSale.TotalAmount, $scope.applicableGST, $scope.WholeSale.GSTApplied);

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

        $scope.GetBillByID = function () {
            var EmailIdFilter = '';
            if ($scope.tokens.UserRole == "Customer") {
                EmailIdFilter = " and Bill/RetailerId eq '" + $scope.SupplierRetailers.SupplierRetailerId;
            }

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
                    "Bill/SaleTypeId",
                    "Bill/SaleCategoryId",
                    "Bill/ShowGSTNo",
                    "Material",
                    "Material/WholeSaleRate",
                    "Material/RetailRate",
                    "Godown/GodownName",
                    //"Status/StatusName",
                    "ItemCategoryId"
                ],
                lookupFields: ["Bill", "Material", "Godown","Status"],
                filter: ["BillNo eq " + $scope.ID + EmailIdFilter],
                //limitTo: "5000",
                orderBy: "CreatedOn desc"
            };

            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.WholeSale = response.data.d.results;
                    //$scope.WholeSale.Quantity = $scope.WholeSale.Quantity;
                    $scope.WholeSale.GSTApplied = $scope.WholeSale[0].Bill.GSTApplied;
                    $scope.WholeSale.TotalAmount = 0;
                    $scope.WholeSale.GSTPercentage = $scope.WholeSale[0].Bill.GSTPercentage;
                    $scope.applicableGST = $scope.WholeSale.GSTPercentage;

                    angular.forEach($scope.WholeSale, function (value) {
                        var rate = 0;
                        if (value.Bill.SaleCategoryId == 1) {
                            rate = value.Material.WholeSaleRate * value.Quantity;
                            value.Rate = value.Material.WholeSaleRate;
                        } else {
                            rate = value.Material.RetailRate * value.Quantity;
                            value.Rate = value.Material.RetailRate;
                            $scope.gridOptions.columnDefs[7].visible = false;
                            $scope.gridOptions.columnDefs[8].visible = false;
                        }
                        value.DisplayName = value.Material.DisplayName;
                        var amount = 0;
                        var discountAmt = 0;
                        if (value.Discount > 0) {
                            discountAmt = rate / 100 * parseFloat(value.Discount);
                            amount = parseFloat(rate) - parseFloat(discountAmt);
                        } else {
                            amount = rate;
                        }
                        value.Amount = amount - parseFloat(value.DLP);
                        $scope.WholeSale.TotalAmount = (parseFloat($scope.WholeSale.TotalAmount) + parseFloat(value.Amount)).toFixed(2);
                        $scope.CalculateGST();
                        /*
                        if (value.Bill.GSTApplied > 0) {
                            $scope.WholeSale.GSTAmount = $scope.WholeSale.TotalAmount * $scope.WholeSale[0].Bill.GSTPercentage / 100;
                        } else {
                            $scope.WholeSale.GSTAmount = 0;
                        }*/

                    });
                    if ($scope.WholeSale[0].Bill.RetailerId != null) {
                        $scope.WholeSale[0].Bill.ContactNo = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale[0].Bill.RetailerId }, true)[0].Contact;
                        $scope.WholeSale[0].Bill.Name = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale[0].Bill.RetailerId }, true)[0].Name;
                    }

                    $scope.gridOptions.data = $scope.WholeSale;
                }
            });
        };

        $scope.GetMaterials = function () {
            var lstItems = {
                title: "Materials",
                fields: ["*", "ItemCategory/ItemCategoryId"],
                lookupFields: ["ItemCategory"],
                orderBy: "DisplayName desc"
            };
            CommonService.GetListItems(lstItems).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.MaterialsData = response.data.d.results;
                }

            });
        };

        $scope.GetMaterialsByCategoryId = function () {
            $scope.currentMaterialLst = $filter('filter')(GlobalVariableService.getMaterialList(), { ItemCategoryId: $scope.WholeSale.ItemCategory }, true);
        };
        $scope.GetGodowns = function (callback) {
            var lstItems = {
                title: "Godowns",
                fields: ["GodownId", "GodownName"],
                orderBy: "GodownName"
            };
            //$scope.showSpinner();
            CommonService.GetListItems(lstItems).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.GodownData = response.data.d.results;

                }
                if (callback)
                    callback();
            });
        };
        $scope.GetGSTPercentageById = function (callback) {
            var postData = {
                title: "GSTPercentages",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.GSTPercentage = response.data.d.results[0].GST;
                }
                if (callback)
                    callback();
            });
        };

        $scope.GetItemCategory = function (callback) {
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
                if (callback)
                    callback();
            });
        };
        $scope.GetStatuses = function () {
            var lstData = {
                title: "Status",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            CommonService.GetListItems(lstData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.StatusList = response.data.d.results;
                    //console.log($scope.ItemCatogoryList);

                }
            });
        };

        $scope.GetSupplierRetailer = function (callback) {
            var emailFilter = '';
            if ($scope.tokens.UserRole == 'Customer') {
                emailFilter = " and Email eq '" + $scope.tokens.UserName + "'";
            }
            var postData = {
                title: "SupplierRetailers",
                fields: ["*"],
                filter: ["Category eq " + $scope.Category.Customer + emailFilter],
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierRetailers = response.data.d.results;
                    //console.log($scope.SupplierRetailers);

                }
                if (callback)
                    callback();
            });
        };

        $scope.SaveNPrint = function (isFormValid) {
            $scope.SubmitItems(isFormValid);
        }

        $scope.AddItem = function () {
            if ($scope.gridOptions.data.length >= 25) {
                toaster.pop('warning', "", "It has reached 25 items on this single bill.", 5000, 'trustedHtml');
                return;
            }
            if ($scope.WholeSale.ItemCategory == undefined) {
                toaster.pop('error', "", "Please select Category", 5000, 'trustedHtml');
                return;
            }
            else if ($scope.currentMaterialId == undefined) {
                toaster.pop('error', "", "Please select material", 5000, 'trustedHtml');
                return;
            }
            else {
                var displayName = $filter('filter')($scope.currentMaterialLst, { MaterialId: $scope.currentMaterialId }, true)[0].DisplayName
                var Rate = 0;
                if ($scope.WholeSale[0].Bill.SaleCategoryId == 1) {
                    Rate = $filter('filter')($scope.currentMaterialLst, { DisplayName: displayName }, true)[0].WholeSaleRate;
                } else {
                    Rate = $filter('filter')($scope.currentMaterialLst, { DisplayName: displayName }, true)[0].RetailRate;
                }

                var item = {
                    "SaleId": 0,
                    "MaterialId": $scope.currentMaterialId,
                    "ItemCategoryId": $scope.WholeSale.ItemCategory,
                    "DisplayName": displayName,
                    "Rate": Rate,
                    "Godown.GodownName": "--Select Godown--",
                    "Quantity": 0,
                    "Discount": 0,
                    "DLP": 0,
                    //"StatusId": "Active",
                    "Amount": 0,
                    "Action": ""
                };
                $scope.WholeSale.push(item);
                $scope.gridOptions.data = $scope.WholeSale;
            }
        };

        $scope.FirstSaveDataAndPrint = function () {

            $scope.SaveBillDetails('S', function () {
                PrintService.GetSingleBillNPrint($scope.BillNo);
            });
        }

        $scope.SubmitItems = function (isFormValid, callback) {
            try {
                var errorMessage = '';
                var isValid = isFormValid;
                $scope.submitted = !isValid;
                var count = $scope.gridOptions.data.length;
                if (count == 0) {
                    toaster.pop('error', "", "No data to save", 5000, 'trustedHtml');
                    return;
                }
                else {
                    angular.forEach($scope.gridOptions.data, function (value, key) {
                        if (value.Godown == undefined || value.Godown == '') {
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
                    if ($scope.WholeSale.Others != null && ($scope.WholeSale.SupplierRetailer == "" || $scope.WholeSale.SupplierRetailer == undefined)) {
                        var supplierRetailers = {
                            "Name": $scope.WholeSale.Others,
                            "Address": "NA",
                            "Email": "NA",
                            "Contact": $scope.WholeSale.ContactNo,
                            "Type": $scope.AdhocType,
                            "Category": $scope.Category.Customer,
                            "CreatedOn": new Date()
                        };
                        $scope.SaveSupplierRetailers(supplierRetailers).then(function (retailerID) {
                            $scope.RetailerId = retailerID;
                            $scope.FirstSaveDataAndPrint();
                        });

                    } else {
                        $scope.RetailerId = $scope.WholeSale[0].Bill.RetailerId;
                        $scope.FirstSaveDataAndPrint();
                    }
                    if (callback)
                        callback();

                } else {
                    toaster.pop('error', "", "Please enter complete data!!", 5000, 'trustedHtml');
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


        $scope.SaveBillDetails = function (mode, callback) {
            try {
                var saleType = 0;
                var billStatus = 0;
                var grandAmount = 0;
                var balanceAmount = 0;
                if (mode && mode == 'c') {
                    billStatus = $scope.BillStatus.Cancelled;
                }
                else
                    billStatus = $scope.BillStatus.Active;

                //Cash
                if ($scope.WholeSale[0].Bill.SaleTypeId == 1 || $scope.WholeSale[0].Bill.SaleTypeId == true) {
                    saleType = $scope.SaleTypeCash;
                    //billStatus = $scope.BillStatus.Active;
                    grandAmount = $scope.WholeSale.TotalAmount;
                    balanceAmount = 0;
                } else {
                    //Credit
                    saleType = $scope.SaleTypeCredit;
                    //billStatus = $scope.BillStatus.Active;
                    grandAmount = 0;
                    balanceAmount = $scope.WholeSale.TotalAmount;
                }
                var postData = {
                    "RetailerId": $scope.RetailerId,
                    // "SaleCategoryId": $scope.SaleCategoryWholeSale,
                    "SaleTypeId": saleType,
                    "GSTApplied": $scope.WholeSale.GSTApplied,
                    "GSTAmount": $scope.WholeSale.GSTAmount.toString(),
                    "GSTPercentage": $scope.applicableGST.toString(),// $scope.WholeSale.GSTPercentage.toString(),
                    "TotalAmount": $scope.WholeSale.TotalAmount.toString(),
                    "DiscountApplied": $scope.IsDiscountApplied,
                    "BillStatus": billStatus,               //Cash --> complete, Credit--> pending
                    "PaidAmt": grandAmount.toString(),      //Credit --> 0. cash --> GrandAmount
                    "BalanceAmt": balanceAmount.toString(), // Credit --> GrandAmount ,cash-->0
                    "GrandTotal": $scope.WholeSale.GrandTotal.toString(),
                    "ShowGSTNo": $scope.WholeSale[0].Bill.ShowGSTNo,
                    "UpdatedOn": new Date(),
                    "UpdatedBy": $scope.tokens.UserName.toString()
                };

                return promise = new Promise((resolve, reject) => {
                    CommonService.UpdateData("Bills", postData, $scope.ID).then(function (response) {
                        if (response != undefined) {
                            // var selectedRows = $filter('filter')($scope.gridOptions.data, { IsSelected: true }, true);
                            var selectedRowsCount = $scope.gridOptions.data.length;
                            if (selectedRowsCount > 0) {
                                var isAlertDone = false;

                                angular.forEach($scope.DeletedRows, function (value, key) {
                                    CommonService.DeleteData("Sales", value.SaleId).then(function (response) {
                                        if (response != undefined) {
                                            console.log("Sale data is deleted");
                                        }
                                    });
                                });


                                angular.forEach($scope.gridOptions.data, function (value, key) {

                                    var salesPostDate = {
                                        "MaterialId": value.MaterialId,//$filter('filter')($scope.MaterialsData, { DisplayName: value.DisplayName }, true)[0].MaterialId,
                                        "Rate": value.Rate,
                                        "Quantity": value.Quantity.toString(),
                                        "Discount": value.Discount.toString(),
                                        "DLP": value.DLP.toString(),
                                        "Amount": value.Amount.toString(),
                                        "BillNo": $scope.ID,
                                        "GodownId": $filter('filter')($scope.GodownData, { GodownName: value.Godown.GodownName }, true)[0].GodownId,
                                        "UpdatedOn": new Date(),
                                        "StatusId": 1,//$filter('filter')($scope.StatusList, { StatusName: value.Status.StatusName }, true)[0].StatusId,
                                        "ItemCategoryId": value.ItemCategoryId
                                    };
                                    if (value.SaleId == 0) {
                                        CommonService.PostData("Sales", salesPostDate).then(function (response1) {
                                            if (response1.SaleId > 0) {
                                                if (!isAlertDone) {
                                                    toaster.pop('success', "", "Bill Data Updated Successfully", 5000, 'trustedHtml');
                                                    isAlertDone = true;
                                                    $scope.DataSaved = true;
                                                    //$location.path('/');
                                                }
                                            }
                                        });
                                    } else {
                                        CommonService.UpdateData("Sales", salesPostDate, value.SaleId).then(function (response1) {
                                            if (response1 != undefined) {
                                                if (!isAlertDone) {
                                                    toaster.pop('success', "", "Bill Data Updated Successfully", 5000, 'trustedHtml');
                                                    isAlertDone = true;
                                                    $location.path('/WholeSaleDashboard');
                                                }
                                            }
                                        });
                                    }

                                });
                                resolve("data saved");
                                setTimeout(function () {
                                    if (callback)
                                        callback();
                                }, 1000);
                            }
                        }
                        else
                            reject("data save failed");
                    });
                });
            } catch (error) {
                console.log("Exception caught in the SaveClaim function. Exception Logged as " + error.message);
            }
            return promise;
        };

        $scope.init = function () {

            GlobalVariableService.validateUrl($location.$$path);
            var AllRights = GlobalVariableService.getRoleRights();
            $scope.CancelBillRights = $filter('filter')(AllRights, { RightsName: $scope.RightsText.CancelBill }, true);

            //$scope.showSpinner();

            $scope.tokens = GlobalVariableService.getTokenInfo();
            //$scope.GetStatuses();
            $scope.GetItemCategory(function () {
                $scope.GetSupplierRetailer(function () {
                    $scope.GetGodowns(function () {
                        $scope.GetGSTPercentageById(function () {
                            if ($scope.ID > 0) {
                                $scope.GetBillByID();
                                //$scope.CancelBillRights = GlobalVariableService.getARights(tokens.UserRole,$scope.RightsText.CancelBill);

                            }
                        });
                    });
                });
            });
            $scope.hideSpinner();
        };

        $scope.init();
    }]);