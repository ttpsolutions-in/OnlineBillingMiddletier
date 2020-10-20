ETradersApp.controller("OnlinePaymentDetailFromWebHookController", ['GlobalVariableService', '$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService, $scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants) {

        $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.ID = $routeParams.ID;
        $scope.Categories = [];
        $scope.OnlinepaymentFromWebhooksList = [];
        $scope.EditOnlinePaymentDetail = {};
        $scope.Types = [];
        $scope.submitted = false;
        $scope.Category = {
            Supplier: 1,
            Customer: 2
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

                // { name: 'No.', field: 'SrNo', width: 50, visible: true, enableFiltering: false, enableSorting: true, headerCellClass: 'text-right', cellClass: 'text-right', displayName: '#', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+(grid.options.paginationPageSize*(grid.options.paginationCurrentPage-1))+1}}</div>' },
                { displayName: 'Payment Id', field: 'payment_id', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Amount', field: 'amount', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Paid By', field: 'buyer', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Phone', field: 'buyer_phone', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Paid To', field: 'paid_to', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Date', field: 'createdon', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Status', field: 'status', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                //{
                //    name: 'Action', width: 120, enableFiltering: false, displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                //        + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditOnlinePaymentDetail/{{row.entity.autoId}}" ><span data-feather="edit"></span> </a>'
                //        + '</div><script>feather.replace()</script>'
                //},

            ],
            data: []

        };

        $scope.gridInventoryOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableSelectAll: true,
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
                    displayName: 'Quantity', field: 'Quantity', width: 80, enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true,
                    cellClass: function (grid, row) { return row.entity.Quantity < 0 ? 'text-right text-danger' : 'text-right'; },
                    headerCellClass: 'text-center'
                },
                {
                    displayName: 'Amount', field: 'Amount', width: 80, enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true,
                    headerCellClass: 'text-center'
                },
                {
                    displayName: 'Supplier', field: 'SupplierRetailer.Name', cellTooltip: true, enableCellEdit: false,
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Godown', field: 'Godown.GodownName', cellTooltip: true, enableCellEdit: false,
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                {
                    width: 80, displayName: 'Paid', field: 'Paid', enableFiltering: false, enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-center',
                    headerCellClass: 'text-center',
                    cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<input type="checkbox" ng-checked="row.entity.onlinePaymentId==grid.appScope.ID?true:false" ng-model="row.entity.Paid" id="Paid" class="form-control"/>'
                        + '</div>'
                }
            ],
            data: []

        };

        $scope.SaveOnlinepaymentFromWebhooks = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;
                if (isValid) {
                    var duplicate = $filter('filter')($scope.OnlinepaymentFromWebhooksList, { Name: $scope.OnlinePaymentDetail.payment_id }, true);
                    //var duplicateEmail = $filter('filter')($scope.OnlinepaymentFromWebhooksList, { Name: $scope.OnlinePaymentDetail.Email }, true);
                    if (duplicate != undefined && duplicate.length > 0) {
                        toaster.pop('error', "", "Payment Id already exists!", 5000, 'trustedHtml');
                    }
                    else {
                        var OnlinepaymentFromWebhooks = {
                            "payment_id": $scope.OnlinePaymentDetail.payment_id.toString(),
                            "amount": $scope.OnlinePaymentDetail.amount.toString(),
                            "buyer": $tokens.UserName.toString(),
                            //"buyer_name": $scope.OnlinePaymentDetail.buyer_name.toString(),
                            //"buyer_phone": $scope.OnlinePaymentDetail.buyer_phone.toString(),
                            "paid_to": $scope.OnlinePaymentDetail.buyer_phone.toString(),
                            "paid_on": $scope.OnlinePaymentDetail.paid_on,
                            //"purpose": $scope.OnlinePaymentDetail.purpose.toString(),
                            //"status": $scope.OnlinePaymentDetail.status.toString(),
                            "id": "dummy",
                            "createdon": new Date()
                        };
                        CommonService.PostData("OnlinepaymentFromWebhooks", OnlinepaymentFromWebhooks).then(function (response) {
                            console.log("response " + response);
                            if (response.autoId > 0) {
                                toaster.pop('success', "", "Payment detail Saved Successfully", 5000, 'trustedHtml');
                                $scope.RedirectDashboard();
                            }
                        }, function (data) {
                            console.log(data);
                        });
                    }
                }
            } catch (error) {
                console.log("Exception caught in the SaveOnlinepaymentFromWebhooks function. Exception Logged as " + error.message);
            }
        };

        //Update Supplier Customers
        $scope.UpdateOnlinepaymentFromWebhooks = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;
                if (isValid) {
                    var duplicate = $filter('filter')($scope.OnlinepaymentFromWebhooksList, function (value, key) {
                        if (value.payment_id.toUpperCase() == $scope.EditOnlinePaymentDetail.PaymentId.toUpperCase() && value.autoId != $scope.ID)
                            return true;
                    });
                    if (duplicate != undefined && duplicate.length > 0)
                        toaster.pop('error', "", "Payment Id already exists!", 5000, 'trustedHtml');
                    else {
                        var OnlinepaymentFromWebhooks = {
                            "payment_id": $scope.EditOnlinePaymentDetail.payment_id.toString(),
                            "amount": $scope.EditOnlinePaymentDetail.amount.toString(),
                            "buyer": $scope.EditOnlinePaymentDetail.buyer.toString(),
                            "buyer_name": $scope.EditOnlinePaymentDetail.buyer_name.toString(),
                            "buyer_phone": $scope.EditOnlinePaymentDetail.buyer_phone.toString(),
                            "paid_to": $scope.EditOnlinePaymentDetail.paid_to.toString(),
                            "paid_on": $scope.EditOnlinePaymentDetail.paid_on,
                            "purpose": $scope.EditOnlinePaymentDetail.purpose.toString(),
                            "status": $scope.EditOnlinePaymentDetail.status.toString(),
                            "id": "dummy",
                            "createdon": new Date()
                        };
                        CommonService.UpdateData("OnlinepaymentFromWebhooks", OnlinepaymentFromWebhooks, $scope.ID).then(function (response) {
                            console.log("response " + response);
                            if (response != undefined) {
                                toaster.pop('success', "", "Online payment detail updated successfully", 5000, 'trustedHtml');
                                $scope.RedirectDashboard();
                            }
                        }, function (data) {
                            console.log(data);
                        });
                    }
                }
            } catch (error) {
                console.log("Exception caught in the SaveOnlinepaymentFromWebhooks function. Exception Logged as " + error.message);
            }
        };

        $scope.GetDataForDashboard = function () {
            $scope.MaterialInventoryList = [];
            var lstBill = {
                title: "OnlinepaymentFromWebhooks",
                fields: [
                    "payment_id"
                    , "amount"
                    , "buyer"
                    , "buyer_phone"
                    , "paid_to"
                    , "createdon"
                    , "status"
                ],
                // lookupFields: ["SupplierRetailer", "Godown", "Material"],
                filter: ["status eq 'completed'"],
                limitTo:20,
                orderBy: "createdon desc"
            };

            if ($scope.searchSupplierRetailer > 0) {
                var customerEmail = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.searchSupplierRetailer }, true)[0].Email;
                if (lstBill.filter == undefined)
                    lstBill.filter = "buyer eq '" + customerEmail + "'";
                else
                    lstBill.filter = lstBill.filter + " and buyer eq '" + customerEmail + "'";

            }

            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.OnlinepaymentFromWebhooksList = response.data.d.results;
                }
                else
                    $scope.OnlinepaymentFromWebhooksList = [];
                $scope.gridOptions.data = $scope.OnlinepaymentFromWebhooksList;

            });
        };
        $scope.GetOnlinepaymentFromWebhooks = function () {
            var lstBill = {
                title: "OnlinepaymentFromWebhooks",
                fields: ["*"],
                //lookupFields: ["Category1", "SupplierRetailType"],
                orderBy: "createdon desc"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.OnlinepaymentFromWebhooksList = response.data.d.results;
                    $scope.gridOptions.data = $scope.OnlinepaymentFromWebhooksList;
                }
            });
        };

        $scope.GetOnlinepaymentFromWebhooksById = function () {
            var lstBill = {
                title: "OnlinepaymentFromWebhooks",
                fields: ["*"], //"Category/Id", "Category/CategoryName"
                filter: ["autoId eq " + $scope.ID],
                orderBy: "createdon desc"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EditOnlinePaymentDetail = response.data.d.results[0];
                }
            });
        };

        $scope.GetSupplierRetailers = function (callback) {

            var lst = {
                title: "SupplierRetailers",
                fields: ["SupplierRetailerId,Email,Name"],

                filter: ["Category eq " + $scope.Category.Customer],
                //limitTo: "5000",
                orderBy: "CreatedOn desc"
            };

            if ($scope.tokens.UserRole == "Customer")
                lstBill.filter += " and Email eq '" + $scope.tokens.UserName + "'";

            CommonService.GetListItems(lst).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierRetailers = response.data.d.results;
                    if (callback)
                        callback();
                }
            });
        };

        $scope.init = function () {

            $scope.tokens = GlobalVariableService.getTokenInfo();
            GlobalVariableService.validateUrl($location.$$path);
            $scope.GetSupplierRetailers(function () {
                if ($scope.ID > 0) {
                    $scope.GetOnlinepaymentFromWebhooksById();
                    $scope.GetDataForDashboard($scope.ID);
                }
                else
                    $scope.GetOnlinepaymentFromWebhooks();
            });

        };

        $scope.init();
    }]);