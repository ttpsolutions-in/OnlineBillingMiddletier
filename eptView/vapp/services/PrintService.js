ETradersApp.factory('PrintService', ['$location', '$http', '$alert', '$filter', 'serviceBaseURL', 'ExceptionHandler', 'CommonService', function ($location, $http, $alert, $filter, serviceBaseURL, ExceptionHandler, CommonService) {

    var PrintService = {};
    var WholeSale = [];
    //var GSTPercentage = [];
    var AllCreditBillNos = [];
    var AllCreditBillDetail = [];
    var SupplierRetailers = [];
    var Category = {
        Supplier: 1,
        Customer: 2
    };
    //var WholeSale.TotalAmount = 0;

    PrintService.printBill = function () {
        var WholeSaleOrRetail = '';
        var colspan = 0;
        var content = "";
        var header = '';
        var body = '';
        var footer = '';
        var strOneBillContent = ''
        var WholeHeader = '';
        var WholeFooter = '';
        WholeHeader = '<html>' +
            '<head>' +
            '<link href="vContent/style/bootstrap.min.css" rel="stylesheet" />  ' +
            '<script type="text/javascript" src="vContent/Scripts/angular.min.js"></script>' +
            '<script type="text/javascript" src="vContent/Scripts/pdfmake.0.1.22.min.js"></script>' +
            '<script type="text/javascript" src="vContent/Scripts/html2canvas.0.4.1.min.js"></script>' +
            '<script type="text/javascript">' +
            'var app = angular.module("MyApp", [])' +
            'app.controller("MyController", function ($scope) {' +

            '$scope.Export = function () {' +
            'html2canvas(document.getElementById("dvPrintBill"), {' +
            'onrendered: function (canvas) {' +
            'var data = canvas.toDataURL();' +
            'var docDefinition = {' +
            'content: [{' +
            'image: data,' +
            'width: 500' +
            '}]' +
            '};' +
            'pdfMake.createPdf(docDefinition).download("Table.pdf");' +
            '}' +
            '});' +
            '}' +
            '</script > '
        '</head>' +
            '<body ng-app="MyApp" ng-controller="MyController">' +
            //'<body>' +
            '<div id="dv" style="margin:150px">  ';
        var previousBillNo = 0;
        angular.forEach(WholeSale, function (billDetail, key) {

            var currentBillNo = billDetail.BillNo;
            // data fetched sorted by billno from database
            // current and previous billno not equal means we need to prepare a new bill.
            if (currentBillNo != previousBillNo) {

                if (key != 0) {
                    strOneBillContent += header + body + footer;
                    header = '';
                    body = '';
                    footer = '';
                }

                if (billDetail.SaleCategoryId == 1) {
                    WholeSaleOrRetail = 1
                    colspan = 6
                }
                else {
                    colspan = 4
                    WholeSaleOrRetail = 2
                }

                header += '<div id="dvPrintBill" style="margin:150px"><div class="row">  ' +
                    '<div class="col-md-12 text-center">  ' +
                    '<h3 style="text-align:center">EPHRAIM TRADERS</h3>  ' +
                    '<span>Churachandpur, Manipur - 795125</span><br />  '
                if (billDetail.ShowGSTNo == 1) {
                    content += '<span>GSTIN - 14BKYPT3527Q1Z2</span> '
                }
                header += '<hr class="newhr" />  ' +
                    '</div>  ' +
                    '<div class="col-md-12">  ' +
                    '<span><b>Name: ' + billDetail.Name + ' </b></span>  ' +
                    '<span class="float-right"><b>Bill No.: ' + billDetail.BillNo + '</b></span><br />  ' +
                    '<span><b>Contact No.: ' + billDetail.Contact + '</b></span>  ' +
                    '<span class="float-right"><b>Bill Date: ' + $filter('date')(billDetail.SaleDate, "dd/MM/yyyy") + '</b></span>  ' +
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
                    header += '<th style="text-align:center">Discount</th>  ' +
                        '<th style="text-align:center">DLP</th>'
                }

                header += '<th style="text-align:center">Amount</th>  ' +
                    '</tr>  ';

                body += '<tr><td align="right">' + key + 1 + '</td> ' +
                    '<td>' + billDetail.DisplayName + '</td> ' +
                    '<td align="right">' + billDetail.Rate + '</td>  ' +
                    '<td align="right">' + billDetail.Quantity + '</td>  '
                if (WholeSaleOrRetail == 1) {
                    body += '<td align="right">' + billDetail.Discount + '</td>' +
                        '<td align="right">' + billDetail.DLP + '</td>  '
                }
                body += '<td align="right">' + billDetail.Amount + '</td></tr>';

                footer += '<tr>  ' +
                    '<td colspan="' + colspan + '" class="text-right">Total Amount</td>  ' +
                    '<td class="text-right">' + parseFloat(billDetail.TotalAmount).toFixed(2) + '</td>  ' +
                    '</tr>  ' +
                    '<tr>  ' +
                    '<td colspan="' + colspan + '" class="text-right">  ' +
                    'GST (' + billDetail.GSTPercentage + ' %)' +
                    '</td>  ' +
                    '<td class="text-right"><span>' + billDetail.GSTAmount + '</span></td>  ' +
                    '</tr>  ' +
                    '<tr>  ' +
                    '<td colspan="' + colspan + '" class="text-right"> Grand Total</td>  ' +
                    '<td class="text-right">' + billDetail.GrandTotal + '</td>' +
                    '</tr>  ' +
                    '</table>  ' +
                    '<br />  ' +
                    '<span>Customer Signature</span>  ' +
                    '<span class="float-right">For <b>EPHRAIM TRADERS</b><br /><br /> Authorised Signatory</span>  ' +
                    '</div>  ' +
                    '</div>  ' +
                    '</div>  '


            } //end of if billno is same.
            else if (currentBillNo == previousBillNo) {
                //var i;
                //for (i = 0; i < billDetail.length; i++) {
                body += '<tr><td align="right">' + key + 1 + '</td> ' +
                    '<td>' + billDetail.DisplayName + '</td> ' +
                    '<td align="right">' + billDetail.Rate + '</td>  ' +
                    '<td align="right">' + billDetail.Quantity + '</td>  '
                if (WholeSaleOrRetail == 1) {
                    body += '<td align="right">' + billDetail.Discount + '</td>' +
                        '<td align="right">' + billDetail.DLP + '</td>  '
                }
                body += '<td align="right">' + billDetail.Amount + '</td></tr>';

            }
            previousBillNo = currentBillNo;
        });

        strOneBillContent += header + body + footer;

        WholeFooter += '<table style="width:100%"><tr><td><button type="button" class="btn btn-primary col-md-offset-5" ng-click="Export()"> <span data-feather="printer"></span>Export to PDF</button></td></tr></table></body></html>';
        content = WholeHeader + strOneBillContent + WholeFooter;


        var mywindow = window.open('', 'PRINT', 'height=800,width=800');
        mywindow.document.write(content);
        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        //$timeout(function () {
        $location.path('/');
        //AllCreditBillDetail = null;
    };
    PrintService.GetCustomerBillsNPrint = function (CustomerId) {
        PrintService.GetWholeSaleByID(CustomerId, function () {
            PrintService.printBill();
        });

        /*
        var lstBill = {
            title: "Bills",
            fields: [
                "BillNo"
                //,"RetailerId"
            ],
            //lookupFields: [""],
            filter: ["RetailerId eq " + CustomerId + " and SaleTypeId eq 2"],
            orderBy: "CreatedOn"
        };

        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                AllCreditBillNos = response.data.d.results;
                var strBillNo = '';
                angular.forEach(AllCreditBillNos, function (value, key) {
                    if (strBillNo.length < 1)
                        strBillNo = value.BillNo;
                    else
                        strBillNo += "," + value.BillNo;
                })
                PrintService.GetWholeSaleByID(strBillNo, function () {
                    PrintService.printBill();
                });
            }
        });
        */
    }
    PrintService.GetSingleBillNPrint = function (BillNo) {
        PrintService.GetWholeSaleByID(BillNo, function () {
            PrintService.printBill();
        });
    }
    PrintService.GetWholeSaleByID = function (customerId, callback) {

        var lstBill = {
            title: "BillDetailsViews",
            fields: [
                "BillNo",
                "Name",
                "SaleDate",
                "RetailerId",
                "MaterialId",
                "DisplayName",
                "Quantity",
                "Discount",
                "DLP",
                "Amount",
                "GodownName",
                "GodownId",
                "GSTApplied",
                "SaleTypeId",
                "SaleCategoryId",
                "GSTPercentage",
                "GSTAmount",
                "DiscountApplied",
                "TotalAmount",
                "GrandTotal",
                "ShowGSTNo",
                "Contact",
                "Rate",
                "Active",
                "BillStatus"
            ],
            //lookupFields: ["Bill", "Material", "Godown","Material/SupplierRetailer"],
            filter: ["RetailerId eq " + customerId],
            //limitTo: "5000",
            orderBy: "BillNo"
        };

        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                WholeSale = response.data.d.results;
                if (callback)
                    callback();
            }
        });
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