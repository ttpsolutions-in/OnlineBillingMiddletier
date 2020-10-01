ETradersApp.controller("ReportController", ['$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService', 'uiGridConstants', function ($scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants) {

    $scope.lineData = {
        labels: [],
        series: [
            [],
            []
        ]
    };
    $scope.lineOptions = {
        fullWidth: true,
        height: '400px',
        stackBars: false,
        lineSmooth: true,
        showArea: true,
    };

    $scope.ReportData = [
        { Month: "Jan", Sale: 5, Quantity: 4 },
        { Month: "Feb", Sale: 4, Quantity: 2 },
        { Month: "Mar", Sale: 3, Quantity: 9 },
        { Month: "Apr", Sale: 7, Quantity: 5 },
        { Month: "May", Sale: 5, Quantity: 4 },
        { Month: "Jun", Sale: 3, Quantity: 3 },
        { Month: "Jul", Sale: 10, Quantity: 6 },
        { Month: "Aug", Sale: 3, Quantity: 4 },
        { Month: "Sep", Sale: 8, Quantity: 7 },
        { Month: "oct", Sale: 10, Quantity: 8 },
        { Month: "Nov", Sale: 6, Quantity: 7 },
        { Month: "Dec", Sale: 8, Quantity: 4 }
    ];


    $scope.GetReportData = function () {
        var lstGet = {
            title: "SaleQuantityAmountForReports",
            fields: ["*"]//,
            //filter: ["SaleDate ge datetime'" + FromDate + "' and SaleDate le datetime'" + ToDate + "'"],
        };
        CommonService.GetListItems(lstGet).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.ReportData = response.data.d.results;

                angular.forEach($scope.ReportData, function (data) {
                    $scope.lineData.labels.push(data.SaleDate);
                    if (data.CategoryName == "Retail")
                        $scope.lineData.series[1].push(data.Amount);
                    else if (data.CategoryName == "Whole Sale")
                        $scope.lineData.series[0].push(data.Amount);
                });

                // console.log($scope.SupplierRetailers);
                //if (callback)
                //    callback();
            }
        });
    };


    $scope.init = function () {
        $scope.GetReportData();
    };

    $scope.init();
}]);
