ETradersApp.controller("ChartController", ['$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService', 'uiGridConstants',
    function ($scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants) {

        var today = new Date();
        $scope.FromDate = today;//$filter('date')(today, 'dd-MM-yyyy');
        $scope.ToDate = today;//$filter('date')(today, 'dd-MM-yyyy');
        $scope.lineData = {
            labels: [],
            series: [
                [],
                []
            ]
        };
        $scope.lineOptions = {
            seriesBarDistance: 10,
            fullWidth: true,
            height: '400px',
            stackBars: false,
            lineSmooth: true,
            showArea: true,
        };

        $scope.ReportData = [
            //{ Month: "Jan", Sale: 5, Quantity: 4 },
            //{ Month: "Feb", Sale: 4, Quantity: 2 },
            //{ Month: "Mar", Sale: 3, Quantity: 9 },
            //{ Month: "Apr", Sale: 7, Quantity: 5 },
            //{ Month: "May", Sale: 5, Quantity: 4 },
            //{ Month: "Jun", Sale: 3, Quantity: 3 },
            //{ Month: "Jul", Sale: 10, Quantity: 6 },
            //{ Month: "Aug", Sale: 3, Quantity: 4 },
            //{ Month: "Sep", Sale: 8, Quantity: 7 },
            //{ Month: "oct", Sale: 10, Quantity: 8 },
            //{ Month: "Nov", Sale: 6, Quantity: 7 },
            //{ Month: "Dec", Quantity: 4 }
        ];

        $scope.GetReportData = function (isFormValid) {
            //angular.forEach($scope.ReportData, function (data) {
            //    $scope.lineData.labels.push(data.Month);
            //    $scope.lineData.series[1].push(data.Sale);
            //    $scope.lineData.series[0].push(data.Quantity);
            //});
            ////$scope.submitted = isFormValid

            if (isFormValid) {

                $scope.lineData = {

                    labels: [],

                    series: [
                        [],
                        []
                    ]
                };

                //$scope.FromDateMonth = $scope.FromDate.getMonth() + 1
                //$scope.FromDateYear = $scope.FromDate.getFullYear()
                //$scope.FromDate.getDate().toString()
                //$scope.FromDateDay = $scope.FromDate.getDate().toString().length==1;
                $scope.FromDateFormatted = $filter('date')($scope.FromDate, 'yyyy-MM-dd');
                $scope.ToDateFormatted = $filter('date')($scope.ToDate, 'yyyy-MM-dd');
                var fromDate = new Date($scope.FromDateFormatted);
                var toDate = new Date($scope.ToDateFormatted);
                var diff = $scope.daysBetween(fromDate, toDate);
                if (diff > 10) {
                    toaster.pop("warning", "", "Too many data. Report Period should be less than 10 days!", 5000, "trustedHtml");
                }
                else {
                    var lstGet = {
                        title: "DailySalesReportViews",
                        fields: ["*"],
                        //lookupFields: ["SaleCategory"],
                        filter: ["SaleDate ge datetime'" + $scope.FromDateFormatted + "' and SaleDate le datetime'" + $scope.ToDateFormatted + "'"],
                        orderBy: "SaleDate"
                    };
                    $scope.ReportData = [];
                    CommonService.GetListItems(lstGet).then(function (response) {
                        if (response && response.data.d.results.length > 0) {
                            
                            $scope.ReportData = response.data.d.results;
                            var prevDate = null;
                            angular.forEach($scope.ReportData, function (value, key) {

                                var singleorMulti = $filter('filter')($scope.ReportData, { SaleDate: value.SaleDate }, true);
                                if (singleorMulti.length === 1) {
                                    if (value.CategoryName === "Retail") {
                                        $scope.lineData.series[0].push(0.00);
                                        $scope.lineData.series[1].push(value.Amount);
                                    }
                                    else if (value.CategoryName === "Whole Sale") {
                                        $scope.lineData.series[0].push(value.Amount);
                                        $scope.lineData.series[1].push(0.00);
                                    }
                                }
                                else if (singleorMulti.length > 1) {
                                    if (value.CategoryName === "Retail") {
                                        $scope.lineData.series[1].push(value.Amount);
                                    }
                                    else if (value.CategoryName === "Whole Sale") {
                                        $scope.lineData.series[0].push(value.Amount);
                                    }
                                }
                                //assuming data is sorted by saledate.
                                var tempLabel = $filter('date')(value.SaleDate, 'ddMMM');
                                if (prevDate !== tempLabel)
                                    $scope.lineData.labels.push(tempLabel);
                                prevDate = tempLabel;

                            });
                            //$scope.ReportData = $scope.uniquiItems;
                            console.log("label", $scope.lineData.labels)
                            console.log("0",$scope.lineData.series[0])
                            console.log("1",$scope.lineData.series[1])
                        }
                    });

                }
            }
        };

        $scope.daysBetween = function (date1, date2) {
            //Get 1 day in milliseconds
            var one_day = 1000 * 60 * 60 * 24;

            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();
            var date2_ms = date2.getTime();

            // Calculate the difference in milliseconds
            var difference_ms = date2_ms - date1_ms;

            // Convert back to days and return
            return Math.round(difference_ms / one_day);
        }
       
        $scope.init = function () {
            //$scope.GetReportData();
        };

        $scope.init();
    }]);
