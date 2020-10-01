ETradersApp.controller("StatisticsController", ['GlobalVariableService', '$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService, $scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }

        //$scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        //$scope.ID = $routeParams.ID;
        $scope.StatisticList = [];
        $scope.drawChart = function () {
            var chart = {
                type: 'bar'
            };
            var title = {
                text: 'Historic World Population by Region'
            };
            var subtitle = {
                text: 'Source: Wikipedia.org'
            };
            var xAxis = {
                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                title: {
                    text: null
                }
            };
            var yAxis = {
                min: 0,
                title: {
                    text: 'Population (millions)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            };
            var tooltip = {
                valueSuffix: ' millions'
            };
            var plotOptions = {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            };
            var legend = {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 100,
                floating: true,
                borderWidth: 1,

                backgroundColor: (
                    (Highcharts.theme && Highcharts.theme.legendBackgroundColor) ||
                    '#FFFFFF'),
                shadow: true
            };
            var credits = {
                enabled: false
            };


            var series = [
                {
                    name: 'Year 1800',
                    data: [107, 31, 635, 203, 2]
                },
                {
                    name: 'Year 1900',
                    data: [133, 156, 947, 408, 6]
                },
                {
                    name: 'Year 2008',
                    data: [973, 914, 4054, 732, 34]
                }
            ];
            var json = {};
            json.chart = chart;
            json.title = title;
            json.subtitle = subtitle;
            json.tooltip = tooltip;
            json.xAxis = xAxis;
            json.yAxis = yAxis;
            json.series = series;
            json.plotOptions = plotOptions;
            json.legend = legend;
            json.credits = credits;
            $('#container').highcharts(json);
        }
        $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        $scope.series = ['Series A', 'Series B'];

        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.GetStatisticList = function () {
            var lstStatistic = {
                title: "SaleQuantityAmountForReports",
                fields: ["DisplayName", "Quantity", "Amount"],
                //filter: ["Active eq true"],
                orderBy: "DisplayName desc"
            };
            $scope.showSpinner();
            CommonService.GetListItems(lstStatistic).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.StatisticList = response.data.d.results;
                    $scope.hideSpinner();
                }
            });
        };

        $scope.GetGodownById = function () {
            var lstGodown = {
                title: "Godowns",
                fields: ["GodownId", "GodownName", "Active"],
                filter: ["GodownId eq " + $scope.ID]
            };
            $scope.showSpinner();
            CommonService.GetListItems(lstGodown).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EditGodown = response.data.d.results[0];
                    $scope.EditGodown.Active = $scope.EditGodown.Active == 1 ? true : false;
                    $scope.hideSpinner();
                }
            });
        };

        $scope.RedirectDashboard = function () {
            $location.path('/GodownDashboard');
        };

        $scope.init = function () {
            GlobalVariableService.validateUrl($location.$$path);
            //$scope.GetGodownById();
            $scope.GetStatisticList();
            //$scope.drawChart();
        };

        $scope.init();
    }]);