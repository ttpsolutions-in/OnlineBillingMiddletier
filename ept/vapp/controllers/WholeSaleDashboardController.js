ETradersApp.controller("WholeSaleDashboardController", ['$window', 'Config', 'GlobalVariableService', 'PrintService', '$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService',
    'uiGridConstants', 'LoginService', function ($window, Config, GlobalVariableService, PrintService, $scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants, LoginService) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }

        $scope.ShowButton = false;
        $scope.PageTitle = "Bills";
        //$scope.isAuthenticated = LoginService.isAuthenticated();
        $scope.ID = $routeParams.ID;
        $scope.WholeSaleList = [];
        $scope.TotalCredit = 0;
        //console.log(LoginService.isAuthenticated());
        var today = new Date();//.toShortFormat();
        console.log(today.setDate(today.getDate() - 1));
        //var todayFormat = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        $scope.searchFromDate = '';//new Date(today);
        $scope.searchToDate = '';//new Date();
        $scope.searchBillNo = "";
        $scope.searchSupplierRetailer = null;
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
                {
                    name: 'ID', field: 'ID', visible: false
                },
                //{ name: 'No.', field: 'SrNo', width: 50, visible: true, enableFiltering: false, enableSorting: true, headerCellClass: 'text-right', cellClass: 'text-right', displayName: '#', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+(grid.options.paginationPageSize*(grid.options.paginationCurrentPage-1))+1}}</div>' },
                { displayName: 'Bill No.', field: 'BillNo', width: '8%', cellTooltip: true, enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center' },
                {
                    displayName: 'Date', field: 'SaleDate', width: 100, cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false,
                    enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center'
                },
                {
                    displayName: 'Customer', field: 'SupplierRetailer.Name', width: 230, enableCellEdit: false, enableCellEditOnFocus: true,
                    cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center'
                },
                { displayName: 'Type', field: 'SaleType.SaleType1', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                {
                    displayName: 'Category', field: 'SaleCategory.CategoryName', width: 125, enableCellEdit: false, cellTooltip: true,
                    cellClass: 'text-left', headerCellClass: 'text-center'
                },
                //{
                //    name: 'GST Applied', width: 80, enableFiltering: false, displayName: 'GST', cellTemplate: '<div class="ui-grid-cell-contents">'
                //        + '{{row.entity.GSTApplied == 1? "Yes" : "No"}}</div><script>feather.replace()</script>'
                //},
                //{
                //    name: 'Disc Applied', width: 120, enableFiltering: false, displayName: 'Disc. Applied', cellTemplate: '<div class="ui-grid-cell-contents">'
                //        + '{{row.entity.DiscountApplied == 1? "Yes" : "No"}}</div><script>feather.replace()</script>'
                //},
                { displayName: 'Total', field: 'TotalAmount', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ displayName: 'GST', field: 'GSTAmount', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Grand Total', field: 'GrandTotal', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Status', field: 'Status.StatusName', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },

                {
                    name: 'Action', width: 120, enableFiltering: false, displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<a id="btnView" type="button" title="View" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#ViewWholeSale/{{row.entity.BillNo}}" ><span data-feather="eye"></span> </a>'
                        //+ '</div><script>feather.replace()</script>'
                        + '&nbsp;&nbsp;<a id="btnEdit" type="button" title="Edit" style="line-height: 0.5;" ng-show="grid.appScope.checkRights(row.entity)" class="btn btn-primary btn-xs" href="#EditBill/{{row.entity.BillNo}}" ><span data-feather="edit"></span> </a>'
                        + '</div><script>feather.replace()</script>'
                },

            ],
            data: []

        };

        $scope.gridOptionsView = {
            enableFiltering: false,
            enableCellEditOnFocus: true,
            enableRowSelection: false,
            enableRowHeaderSelection: true,
            enableSelectAll: true,
            enableColumnResizing: true,
            showColumnFooter: false,
            columnDefs: [
                {
                    name: 'ID', field: 'ID', visible: false
                },
                {
                    name: 'ItemCategoryId', field: 'ItemCategoryId', visible: false
                },

                { displayName: 'Particular', field: 'Material.DisplayName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Rate', field: 'Rate', cellTooltip: true, enableCellEdit: false, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ displayName: 'Unit', field: 'Material.Unit', visible : false, cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                { displayName: 'Quantity', field: 'Quantity', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Discount', field: 'Discount', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'DLP', field: 'DLP', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { displayName: 'Amount', field: 'TotalAmount', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },

            ],
            data: []

        };
        $scope.printCustomerBills = function () {
            PrintService.GetCustomerBillsNPrint($scope.WholeSaleList[0].SupplierRetailer.SupplierRetailerId);
        }
        $scope.print = function () {
            PrintService.GetSingleBillNPrint($scope.WholeSale[0].Bill.BillNo)
        }
        $scope.checkRights = function (row) {

            return ((row.SaleCategory.CategoryName == "Whole Sale" && $scope.WholeSaleEditRights.length > 0) || (row.SaleCategory.CategoryName == "Retail" && $scope.RetailEditRights.length > 0))
        }
        $scope.Export = function () {
            html2canvas(document.getElementById('tblCustomers'), {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("Table.pdf");
                }
            });
        }
        $scope.GetDataForDashboard = function (callback) {
            $scope.WholeSaleList = [];
            var lstBill = {
                title: "Bills",
                fields: [
                    "BillNo"
                    , "SaleDate"
                    , "SupplierRetailer/SupplierRetailerId"
                    , "SupplierRetailer/Name"
                    , "SupplierRetailer/Email"
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
            if ($scope.searchFromDate != "" && $scope.searchToDate != "") {
                var toDate = $filter('date')($scope.searchToDate, 'yyyy-MM-dd');

                var fromDate = $filter('date')($scope.searchFromDate, 'yyyy-MM-dd');

                if (lstBill.filter == undefined)
                    lstBill.filter = "SaleDate ge datetime'" + fromDate + "' and SaleDate le datetime'" + toDate + "'";
                else
                    lstBill.filter = lstBill.filter + " and SaleDate ge datetime'" + fromDate + "' and SaleDate le datetime'" + toDate + "'";

            }
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
            if ($scope.tokens.UserRole == "Customer") {
                if (lstBill.filter == undefined)
                    lstBill.filter = "SupplierRetailer/Email eq '" + $scope.tokens.UserName + "'";
                else
                    lstBill.filter += " and SupplierRetailer/Email eq '" + $scope.tokens.UserName + "'";

            }

            //$scope.showSpinner();
            $scope.WholeSaleList = [];
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.WholeSaleList = response.data.d.results;

                    if ($scope.searchSupplierRetailer > 0) {
                        $scope.GetOnlinePaymentDetails($scope.WholeSaleList[0].SupplierRetailer.Email);
                        $scope.ShowButton = true;
                    }
                    else
                        $scope.ShowButton = false;
                    //$scope.searchSupplierRetailer
                    if (callback)
                        callback();
                }

                $scope.gridOptions.data = $scope.WholeSaleList;
                $scope.GetTotalCredit();

            });
        };
        $scope.payBill = function () {
            $window.location.href = Config.ServiceBaseURL + "/PaymentOnline.aspx?paymenttype=fromcustomer&RetailerId=" + $scope.searchSupplierRetailer;
            //$location.path("/PaymentOnline");

            //$window.location.href= Config.ServiceBaseURL + "/payment.html"
        }
        $scope.GetWholeSaleByID = function () {

            var EmailIdFilter = '';
            if ($scope.tokens.UserRole == "Customer") {

                EmailIdFilter = " and Bill/RetailerId eq " + $scope.SupplierRetailers[0].SupplierRetailerId;
            }

            var lstBill = {
                title: "Sales",
                fields: [
                    "*",
                    "Bill/SaleDate",
                    "Bill/BillNo",
                    "Bill/RetailerId",
                    "Bill/PaidAmt",
                    "Bill/GSTPercentage",
                    "Bill/GrandTotal",
                    "Bill/GSTAmount",
                    "Bill/GSTApplied",
                    "Bill/SaleTypeId",
                    "Bill/SaleCategoryId",
                    "Bill/ShowGSTNo",
                    "Material",
                    "Godown/GodownName",
                    "Material/WholeSaleRate",
                    "Material/RetailRate"
                ],
                lookupFields: ["Bill", "Material", "Godown"],
                filter: ["BillNo eq " + $scope.ID + EmailIdFilter],
                //limitTo: "5000",
                orderBy: "CreatedOn desc"
            };

            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.WholeSale = response.data.d.results;

                    $scope.WholeSale.TotalAmount = 0;

                    angular.forEach($scope.WholeSale, function (value) {
                        var rate = 0;
                        if (value.Bill.SaleCategoryId == 1) {
                            rate = value.Material.WholeSaleRate * value.Quantity;
                            value.Rate = value.Material.WholeSaleRate;
                        } else {
                            rate = value.Material.RetailRate * value.Quantity;
                            value.Rate = value.Material.RetailRate;
                            //  $scope.gridOptionsView.columnDefs[6].visible = false;
                            //  $scope.gridOptionsView.columnDefs[7].visible = false;
                        }

                        var amount = 0;
                        var discountAmt = 0;
                        if (value.Discount > 0) {
                            discountAmt = rate / 100 * parseFloat(value.Discount);
                            amount = parseFloat(rate) - parseFloat(discountAmt);
                        } else {
                            amount = rate;
                        }
                        value.TotalAmount = amount - parseFloat(value.DLP);
                        $scope.WholeSale.TotalAmount = $scope.WholeSale.TotalAmount + parseFloat(value.TotalAmount);
                        if (value.Bill.GSTApplied > 0) {
                            $scope.WholeSale.GSTAmount = $scope.WholeSale.TotalAmount * $scope.GSTPercentage[0].GST / 100;
                        } else {
                            $scope.WholeSale.GSTAmount = 0;
                        }

                    });
                    $scope.WholeSale[0].Bill.Contact = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale[0].Bill.RetailerId }, true)[0].Contact;
                    $scope.WholeSale[0].Bill.Name = $filter('filter')($scope.SupplierRetailers, { SupplierRetailerId: $scope.WholeSale[0].Bill.RetailerId }, true)[0].Name;

                }
            });
        };

        $scope.GetGSTPercentage = function () {
            var lstBill = {
                title: "GSTPercentages",
                fields: ["*"]
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.GSTPercentage = response.data.d.results;
                }
            });
        };

        $scope.GetOnlinePaymentDetails = function (customerEmail) {

            var lst = {
                title: "OnlinepaymentFromWebhooks",
                fields: ["*"],
                //lookupFields: ["SupplierRetailer", "SaleCategory", "SaleType", "Status"],
                filter: ["buyer eq '" + customerEmail + "' and status eq 'successful'"],
                //limitTo: "5000",
                orderBy: "createdon desc"
            };

            CommonService.GetListItems(lst).then(function (response) {

                if (response && response.data.d.results.length > 0) {
                    $scope.TotalOnlinePaidlist = response.data.d.results;
                    $scope.TotalOnlinePaidAmount = 0;
                    angular.forEach($scope.TotalOnlinePaidlist, function (value, key) {
                        $scope.TotalOnlinePaidAmount = parseFloat($scope.TotalOnlinePaidAmount) + parseFloat(value.amount);
                    })
                }
            });
        };

        $scope.GetSupplierRetailers = function (callback) {

            var lstBill = {
                title: "SupplierRetailers",
                fields: ["*"],
                //lookupFields: ["SupplierRetailer", "SaleCategory", "SaleType", "Status"],
                filter: ["Category eq " + $scope.Category.Customer],
                //limitTo: "5000",
                orderBy: "CreatedOn desc"
            };

            if ($scope.tokens.UserRole == "Customer")
                lstBill.filter += " and Email eq '" + $scope.tokens.UserName + "'";

            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.SupplierRetailers = response.data.d.results;
                    if (callback)
                        callback();
                }
            });
        };
        $scope.RedirectDashboard = function () {
            $location.path('/WholeSaleDashboard');
        };
        $scope.GetTotalCredit = function () {
            $scope.TotalCredit = 0;
            $scope.TotalCash = 0;

            if ($scope.WholeSaleList.length > 0) {
                angular.forEach($scope.WholeSaleList, function (items) {
                    if (items.SaleType.SaleTypeId == 2) //credit
                        $scope.TotalCredit += parseFloat(items.GrandTotal);
                    else //cash
                        $scope.TotalCash += parseFloat(items.GrandTotal);
                });
                $scope.TotalCredit = parseFloat($scope.TotalCredit).toFixed(2);
                $scope.TotalCash = parseFloat($scope.TotalCash).toFixed(2);
            }
            //return $scope.TotalCredit.toFixed(2);
        };
        $scope.init = function () {
            $scope.tokens = GlobalVariableService.getTokenInfo();
            GlobalVariableService.validateUrl($location.$$path);

            //$scope.UserRole = tokens.UserRole;
            //$scope.UserName = tokens.UserName;
            $scope.GetGSTPercentage();
            $scope.GetSupplierRetailers(function () {

                if ($scope.ID > 0) {
                    //$timeout(function () {
                    $scope.GetWholeSaleByID();
                    //}, 200);

                }
                else {
                    $scope.GetDataForDashboard(function () {
                        $scope.GetTotalCredit();
                    });
                }
            });
            var AllRights = GlobalVariableService.getRoleRights();
            $scope.WholeSaleEditRights = $filter('filter')(AllRights, { RightsName: "WholeSaleEdit" }, true);
            $scope.RetailEditRights = $filter('filter')(AllRights, { RightsName: "RetailEdit" }, true);
        };

        $scope.init();
    }]);