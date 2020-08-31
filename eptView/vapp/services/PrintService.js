ETradersApp.factory('PrintService', ['$location', '$http', '$alert', '$filter', 'serviceBaseURL', 'ExceptionHandler', 'CommonService', function ($location,$http, $alert, $filter, serviceBaseURL, ExceptionHandler, CommonService) {

    var PrintService = {};
    var WholeSale = [];
    var GSTPercentage = [];
    var SupplierRetailers = [];
    var Category = {
        Supplier: 1,
        Customer: 2
    };
    //var WholeSale.TotalAmount = 0;

    PrintService.printBill = function () {
        var WholeSaleOrRetail = '';
        var colspan = 0;
        if (WholeSale[0].Bill.SaleCategoryId == 1) {
            WholeSaleOrRetail = 1
            colspan = 6
        }
        else {
            colspan = 4
            WholeSaleOrRetail = 2
        }


        var content = "";
        content = '<html>' +
            '<head>' +
            '<link href="vContent/style/bootstrap.min.css" rel="stylesheet" />  ' +
            '<script type="text/javascript" src="vContent/Scripts/angular.min.js"></script>' +
            '</head>' +
            '<body>' +
            '<div id="dvPrintBill" style="margin:150px">  ' +
            '<div class="row">  ' +
            '<div class="col-md-12 text-center">  ' +
            '<h3 style="text-align:center">EPHRAIM TRADERS</h3>  ' +
            '<span>Churachandpur, Manipur - 795125</span><br />  '
        if (WholeSale[0].Bill.ShowGSTNo == 1) {
            content += '<span>GSTIN - 14BKYPT3527Q1Z2</span> '
        }
        content +='<hr class="newhr" />  ' +
            '</div>  ' +
            '<div class="col-md-12">  ' +
            '<span><b>Name: ' + WholeSale[0].Bill.Name + ' </b></span>  ' +
            '<span class="float-right"><b>Bill No.: ' + WholeSale[0].BillNo + '</b></span><br />  ' +
            '<span><b>Contact No.: ' + WholeSale[0].Bill.Contact + '</b></span>  ' +
            '<span class="float-right"><b>Bill Date: ' + $filter('date')(WholeSale[0].Bill.SaleDate, "dd/MM/yyyy") + '</b></span>  ' +
            '</div>  ' +
            '</div>  ' +
            '<hr />  ' +
            '<div class="form-row">  ' +
            '<div class="col-md-12 nopadding">  ' +
            '<table class="table table-sm table-striped table-bordered table-condensed">  ' +
            '<tr>  ' +
            '<th style="text-align:center">No.</th>  ' +
            '<th style="text-align:center">Particular</th>  ' +
            '<th style="text-align:center">Rate</th>  ' +
            '<th style="text-align:center">Quantity</th>'
        if (WholeSaleOrRetail == 1) {
            content += '<th style="text-align:center">Discount</th>  ' +
                '<th style="text-align:center">DLP</th>'
        }

        content += '<th style="text-align:center">Amount</th>  ' +
            '</tr>  ';
        var i;
        for (i = 0; i < WholeSale.length; i++) {
            content += '<tr><td align="right">' + (i + 1) + '</td> ' +
                '<td>' + WholeSale[i].Material.DisplayName + '</td> ' +
                '<td align="right">' + WholeSale[i].Rate + '</td>  ' +
                '<td align="right">' + WholeSale[i].Quantity + '</td>  '
            if (WholeSaleOrRetail == 1) {
                content += '<td align="right">' + WholeSale[i].Discount + '</td>' +
                    '<td align="right">' + WholeSale[i].DLP + '</td>  '
            }
            content += '<td align="right">' + WholeSale[i].TotalAmount + '</td></tr>';
        };


        content += '<tr>  ' +
            '<td colspan="' + colspan + '" class="text-right">Total Amount</td>  ' +
            '<td class="text-right">' + parseFloat(WholeSale[0].Bill.TotalAmount).toFixed(2) + '</td>  ' +
            '</tr>  ' +
            '<tr>  ' +
            '<td colspan="' + colspan + '" class="text-right">  ' +
            'GST (' + WholeSale[0].Bill.GSTPercentage + ' %)' +
            '</td>  ' +
            '<td class="text-right"><span>' + WholeSale[0].Bill.GSTAmount + '</span></td>  ' +
            '</tr>  ' +
            '<tr>  ' +
            '<td colspan="' + colspan + '" class="text-right"> Grand Total</td>  ' +
            //'<td class="text-right">' + (WholeSale[0].Bill.PaidAmt > 0 ? WholeSale[0].Bill.PaidAmt : WholeSale[0].Bill.BalanceAmt) + '</td>' +
            '<td class="text-right">' + WholeSale[0].Bill.GrandTotal + '</td>' +
            '</tr>  ' +
            '</table>  ' +
            '<br />  ' +
            '<span>Customer Signature</span>  ' +
            '<span class="float-right">For <b>EPHRAIM TRADERS</b><br /><br /> Authorised Signatory</span>  ' +
            '</div>  ' +
            '</div>  ' +
            '</div>  ' +
            '</body>  ' +
            '</html>  ';

        var mywindow = window.open('', 'PRINT', 'height=800,width=800');
        mywindow.document.write(content);
        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        //$timeout(function () {
        $location.path('/');
        //}, 2000);
    };

    PrintService.GetWholeSaleByID = function (BillNo) {
        
        PrintService.GetSupplierCustomer(function () {
            PrintService.GetGSTPercentage(function () {

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
                        "Bill/GSTAmount",
                        "Bill/GSTPercentage",
                        "Bill/TotalAmount",
                        "Bill/SaleTypeId",
                        "Bill/SaleCategoryId",
                        "Bill/ShowGSTNo",
                        "Bill/GrandTotal",
                        "Material",
                        "Godown/GodownName",
                        "Material/WholeSaleRate",
                        "Material/RetailRate"
                    ],
                    lookupFields: ["Bill", "Material", "Godown"],
                    filter: ["BillNo eq " + BillNo],
                    //limitTo: "5000",
                    orderBy: "CreatedOn desc"
                };

                CommonService.GetListItems(lstBill).then(function (response) {
                    if (response && response.data.d.results.length > 0) {
                        WholeSale = response.data.d.results;

                        WholeSale.TotalAmount = 0;

                        angular.forEach(WholeSale, function (value) {
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
                            WholeSale.TotalAmount = WholeSale.TotalAmount + parseFloat(value.TotalAmount);
                            if (value.Bill.GSTApplied > 0) {
                                WholeSale.GSTAmount = WholeSale.TotalAmount * GSTPercentage[0].GST / 100;
                            } else {
                                WholeSale.GSTAmount = 0;
                            }

                        });
                        WholeSale[0].Bill.Contact = $filter('filter')(SupplierRetailers, { SupplierRetailerId: WholeSale[0].Bill.RetailerId }, true)[0].Contact;
                        WholeSale[0].Bill.Name = $filter('filter')(SupplierRetailers, { SupplierRetailerId: WholeSale[0].Bill.RetailerId }, true)[0].Name;
                        PrintService.printBill();
                    }
                });
            })
        })
    };
    PrintService.GetSupplierCustomer = function (callback) {
        var lstBill = {
            title: "SupplierRetailers",
            fields: ["*"],
            //lookupFields: ["SupplierRetailer", "SaleCategory", "SaleType", "Status"],
            filter: ["Category eq " + 2],
            //limitTo: "5000",
            orderBy: "CreatedOn desc"
        };
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                SupplierRetailers = response.data.d.results;

            }
        });
        callback();
    };

    PrintService.GetGSTPercentage = function (callback) {
        var lstBill = {
            title: "GSTPercentages",
            fields: ["*"]
        };
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                GSTPercentage = response.data.d.results;
            }
            callback();
        });
    };




    return PrintService;

}]);