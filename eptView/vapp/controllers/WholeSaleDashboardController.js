ETradersApp.controller("WholeSaleDashboardController", ['PrintService', '$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService', 'uiGridConstants', 'LoginService', function (PrintService,$scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants, LoginService) {
    $scope.ShowSpinnerStatus = false;

    $scope.showSpinner = function () {
        $scope.ShowSpinnerStatus = true;
    }
    $scope.hideSpinner = function () {
        $scope.ShowSpinnerStatus = false;
    }

    $scope.PageTitle = "Sales";
    //$scope.isAuthenticated = LoginService.isAuthenticated();
    $scope.ID = $routeParams.ID;
    $scope.WholeSaleList = [];
    //console.log(LoginService.isAuthenticated());
    var today = new Date();//.toShortFormat();
    console.log(today.setDate(today.getDate() - 1));
    //var todayFormat = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    $scope.searchFromDate = new Date(today);
    $scope.searchToDate = new Date();
    $scope.searchBillNo = "";
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
                displayName: 'Sale Date', field: 'SaleDate', width: 100, cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false,
                enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center'
            },
            {
                displayName: 'Name', field: 'SupplierRetailer.Name', width: 230, enableCellEdit: false, enableCellEditOnFocus: true,
                cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center'
            },
            { displayName: 'Sale Type', field: 'SaleType.SaleType1', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            {
                displayName: 'Sale Category', field: 'SaleCategory.CategoryName', width: 125, enableCellEdit: false, cellTooltip: true,
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
            { displayName: 'Total Amount', field: 'TotalAmount', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { displayName: 'GST Amount', field: 'GSTAmount', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { displayName: 'Grand Total', field: 'GrandTotal', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { displayName: 'Status', field: 'Status.StatusName', width: 100, enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },

            {
                name: 'Action', width: 120, enableFiltering: false, displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="View" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#ViewWholeSale/{{row.entity.BillNo}}" ><span data-feather="eye"></span> </a>'
                    //+ '</div><script>feather.replace()</script>'
                    + '&nbsp;&nbsp;<a id="btnEdit" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditBill/{{row.entity.BillNo}}" ><span data-feather="edit"></span> </a>'
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
    $scope.print = function () {
        PrintService.GetWholeSaleByID($scope.ID);
    }
        
    $scope.GetDataForDashboard = function () {
        $scope.WholeSaleList = [];
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
                ,"GSTAmount"
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
                $scope.WholeSaleList = response.data.d.results;

            }
            $scope.gridOptions.data = $scope.WholeSaleList;
          //  $scope.hideSpinner();
        });
    };

    $scope.GetWholeSaleByID = function () {
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
            lookupFields: ["Bill", "Material","Godown"],
            filter: ["BillNo eq " + $scope.ID],
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



    $scope.GetSupplierRetailers = function () {
        var lstBill = {
            title: "SupplierRetailers",
            fields: ["*"],
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
        $scope.GetGSTPercentage();
        if ($scope.ID > 0) {
            //$timeout(function () {
                $scope.GetWholeSaleByID();
            //}, 200);
            
        }
        else {
            $scope.GetDataForDashboard();
        }
    };

    $scope.init();
}]);