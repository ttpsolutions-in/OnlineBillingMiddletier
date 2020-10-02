ETradersApp.controller("EmployeeAttendanceController", ['$timeout', 'GlobalVariableService', '$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function ($timeout, GlobalVariableService, $scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }

        $scope.MonthList = [
            { "Month": "01" },
            { "Month": "02" },
            { "Month": "03" },
            { "Month": "04" },
            { "Month": "05" },
            { "Month": "06" },
            { "Month": "07" },
            { "Month": "08" },
            { "Month": "09" },
            { "Month": "10" },
            { "Month": "11" },
            { "Month": "12" }
        ]
        $scope.YearList = [

        ];
        $scope.makeYear = function () {
            var year = new Date().getFullYear();
            var myyear = { "Year": year };
            $scope.YearList.push(myyear);
            var newYear = year - 1;
            myyear = { "Year": newYear };
            $scope.YearList.push(myyear);
        }

        $scope.searchCategory = '';
        $scope.searchDisplayName = '';
        $scope.searchDescription = '';
        $scope.MainRoleId = 0;
        //$scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.ID = $routeParams.ID;
        $scope.EmployeeAttendanceList = [];
        $scope.EmployeeRolesList = [];
        $scope.EditEmployeeAttendance = {};
        $scope.EmployeeAttendance = {
            "AttendanceId": 0
            , "EmployeeNo": 0
            , "Date": ''
            , "Present": 1

        }
        $scope.submitted = false;
        //$scope.ItemCatogoryList = [];

        $scope.gridOptions = {
            //enableFiltering: true,
            enableCellEditOnFocus: false,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            enableSelectAll: false,
            enableColumnResizing: true,
            showColumnFooter: false,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 50,
            columnDefs: [

                //{ width: 100, displayName: 'Rights Management Id', field: 'EmployeeAttendanceId', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },

                {
                    width: 250, displayName: 'Employee', field: 'EmployeeDetail.EmployeeName', enableFiltering: false, enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left',
                    headerCellClass: 'text-center'
                },
                { width: 250, displayName: 'Date', field: 'Date', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                {
                    width: 80, displayName: 'Present', field: 'Present', enableFiltering: false, enableCellEdit: true, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-center',
                    headerCellClass: 'text-center',
                    cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<input type="checkbox" ng-checked="row.entity.Present==1?true:false" ng-click="grid.appScope.updateActive(row)" ng-model="row.entity.Present" id="Active" class="form-control"/>'
                        + '</div>'
                },
                //{
                //    name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                //        + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditEmployeeAttendance/{{row.entity.EmployeeAttendanceId}}" ><span data-feather="edit"></span> </a>'
                //        + '</div><script>feather.replace()</script>'
                //},
                { displayName: 'AttendanceId', field: 'AttendanceId', enableCellEdit: false, visible: false },
                { displayName: 'EmployeeNo', field: 'EmployeeDetail.EmployeeNo', enableCellEdit: false, visible: false },
                //  { displayName: 'edited', field: 'edited', enableCellEdit: false, visible: false }

            ],
            data: []
        };
        $scope.updateActive = function (params) {
            if (params.entity.Present === 0)
                params.entity.Present = 1;
            else
                params.entity.Present = 0;
            //params.entity.edited = 1;
        }
        $scope.SaveEmployeeAttendances = function () {
            try {

                $scope.SaveProcess(function () {

                    $scope.EmployeeAttendanceList = [];
                    $scope.gridOptions.data = null;
                    toaster.pop('success', "", "Attendance Saved Successfully", 5000, 'trustedHtml');
                    //$scope.RedirectDashboard();
                    //$scope.GetDataForDashboard();

                });

            } catch (error) {
                console.log("Exception caught in the save attendance function. Exception Logged as " + error.message);
            }
        };

        $scope.SaveProcess = function (callback) {

            angular.forEach($scope.gridOptions.data, function (value, key) {
                var attendanceDate = value.Date == null ? $scope.AttendanceDate : value.Date;
                var values = {
                    //"EmployeeAttendanceId": value.EmployeeAttendanceId
                    "EmployeeNo": value.EmployeeDetail.EmployeeNo
                    , "Date": attendanceDate
                    , "Present": value.Present == true ? 1 : 0
                };
                if (value.AttendanceId == 0 || value.AttendanceId == undefined) {

                    CommonService.PostData("EmployeeAttendances", values).then(function (response1) {

                    }, function (data) {
                        console.log(data);
                    });
                }
                else {

                    CommonService.UpdateData("EmployeeAttendances", values, value.AttendanceId).then(function (response) {
                    }, function (data) {
                        console.log(data);
                    });

                }
            });
            if (callback)
                callback();

        }
        //Update Employees
        $scope.UpdateEmployeeAttendances = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;

                if (isValid) {
                    //var varActive = $scope.EditEmployeeAttendance.Present == true ? 1 : 0;
                    //var duplicate = $filter('filter')($scope.EmployeeAttendanceList, { RightsId: $scope.EditEmployeeAttendance.RightsId, RoleId: $scope.EditEmployeeAttendance.RoleId, Active: varActive }, true)
                    //if (duplicate != undefined && duplicate.length > 0) {
                    //    //toaster.pop('error', "", "Role Rights Already Exists!", 5000, 'trustedHtml');
                    //    sweetAlert("Error", "Role Rights Already Exists!", "error");
                    //}
                    //else {

                    var values = {
                        "AttendanceId": $scope.EditEmployeeAttendance.AttendanceId
                        , "Date": $scope.EditEmployeeAttendance.Date
                        //   , "Present": $scope.EditEmployeeAttendance.Present
                        , "Present": $scope.EditEmployeeAttendance.Active == true ? 1 : 0
                    };
                    CommonService.UpdateData("EmployeeAttendances", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Attendance Updated Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                    //}

                }
            } catch (error) {
                console.log("Exception caught in the update Attendance function. Exception Logged as " + error.message);
            }
        };

        $scope.GetRights = function (callback) {
            var postData = {
                title: "Rights",
                fields: ["*"],
                filter: ["Active eq 1"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.Rights = response.data.d.results;
                }
                callback();
            });
        };
        $scope.GetAttendanceReport = function (isFormValid) {

            $scope.submitted = !isFormValid;

            if (isFormValid) {

                $scope.EmployeeAttendanceList = [];
                $scope.gridOptions.data = null;
                var mydate = new Date($scope.AttendanceYear,$scope.AttendanceMonth,0);
                var lastDay = mydate.getDate();

                $scope.AttendanceFromDate = $scope.AttendanceYear + '-' + $scope.AttendanceMonth + '-' + "01";
                $scope.AttendanceToDate = $scope.AttendanceYear + '-' + $scope.AttendanceMonth + '-' + lastDay;
                
                var lstEmployeeAttendance = {
                    title: "EmployeeAttendances",
                    fields: ["*", "EmployeeDetail/EmployeeName"],
                    lookupFields: ["EmployeeDetail"],
                    filter: ["Date ge datetime'" + $scope.AttendanceFromDate + "' and Date le datetime'" + $scope.AttendanceToDate + "' and EmployeeNo eq " +$scope.EmployeeNo],
                    //limitTo: 20,
                    //orderBy: "EmployeeRole/RoleName"
                };

                CommonService.GetListItems(lstEmployeeAttendance).then(function (response) {
                    if (response && response.data.d.results.length > 0) {
                        $scope.EmployeeAttendanceList = response.data.d.results;
                        angular.forEach($scope.EmployeeAttendanceList, function (value, key) {
                            value.Present = value.Present == 1 ? true : false;
                            value.Date = $filter('date')(value.Date, "dd/MM/yyyy");
                        })                        
                    }
                    $scope.gridOptions.data = $scope.EmployeeAttendanceList;
                });
            }
        }
        $scope.GetDataForDashboard = function (isFormValid) {

            $scope.submitted = !isFormValid;

            if (isFormValid) {

                $scope.EmployeeAttendanceList = null;
                $scope.gridOptions.data = null;
                var today = new Date();
                if ($scope.AttendanceDate == undefined) {
                    toaster.pop("error", "", "Please select Date.", 5000, "truestedHtml");
                    return;
                }
                else if ($scope.AttendanceDate > today) {

                    toaster.pop("error", "", "Please select Date less than or equal to Today.", 5000, "truestedHtml");
                    return;
                }

                $scope.AttendanceMonth = ($scope.AttendanceDate.getMonth() + 1).toString();
                if ($scope.AttendanceMonth.length == 1)
                    $scope.AttendanceMonth = "0" + $scope.AttendanceMonth;
                if ($scope.AttendanceMonth.length == 1)
                    $scope.AttendanceMonth = "0" + $scope.AttendanceMonth;
                $scope.AttendanceDay = $scope.AttendanceDate.getDate().toString();
                if ($scope.AttendanceDay.length == 1)
                    $scope.AttendanceDay = "0" + $scope.AttendanceDay;

                $scope.onlyDate = $scope.AttendanceDate.getFullYear() + '-' + $scope.AttendanceMonth + '-' + $scope.AttendanceDay;
                $scope.DateParam = $scope.onlyDate + 'T00:00:00.000Z';

                var lstEmployeeAttendance = {
                    title: "EmployeeAttendances",
                    fields: ["*", "EmployeeDetail/EmployeeName"],
                    lookupFields: ["EmployeeDetail"],
                    filter: ["Date eq datetime'" + $scope.onlyDate + "'"],
                    //limitTo: 20,
                    //orderBy: "EmployeeRole/RoleName"
                };

                CommonService.GetListItems(lstEmployeeAttendance).then(function (response) {
                    if (response && response.data.d.results.length > 0) {
                        $scope.EmployeeAttendanceList = response.data.d.results;
                        angular.forEach($scope.EmployeeAttendanceList, function (value, key) {
                            value.Present = value.Present == 1 ? true : false;
                            value.Date = $filter('date')(value.Date, "dd/MM/yyyy");
                        })
                    }
                    else {
                        $scope.EmployeeAttendanceList = [];

                        var lstEmployee = {
                            title: "EmployeeDetails",
                            fields: ["EmployeeName", "EmployeeNo"],
                            filter: ["Active eq 1"]
                        };
                        CommonService.GetListItems(lstEmployee).then(function (response) {
                            if (response && response.data.d.results.length > 0) {

                                $scope.EmployeeList = response.data.d.results;
                                angular.forEach($scope.EmployeeList, function (value, key) {
                                    var AttendanceNew = {
                                        "EmployeeDetail":
                                            { "EmployeeName": value.EmployeeName, "EmployeeNo": value.EmployeeNo },
                                        "AttendanceId": 0,
                                        "Date": $filter('date')($scope.DateParam, "dd/MM/yyyy"),
                                        "Present": false,
                                        "Comments": ""
                                    }

                                    $scope.EmployeeAttendanceList.push(AttendanceNew);
                                })
                            }
                        });
                    }
                    $scope.gridOptions.data = $scope.EmployeeAttendanceList;
                    //$scope.hideSpinner();
                });
            }
        }
        $scope.GetEmployee = function () {
            var lstRoles = {
                title: "EmployeeDetails",
                fields: ["EmployeeNo", "EmployeeName"],//,"ItemCategory/ItemCategoryName"],
                filter: ["Active eq 1"]
                //lookupFields: ["ItemCategory"],

            };
            CommonService.GetListItems(lstRoles).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeList = response.data.d.results;
                }
            });
        };

        $scope.GetEmployeeAttendanceById = function () {
            var lstEmployeeAttendance = {
                title: "EmployeeAttendances",
                fields: ["*"],//, "EmployeeDetail/EmployeeName"],
                filter: ["AttendanceId eq " + $scope.ID],
                //lookupFields: ["EmployeeDetail"],
                orderBy: "EmployeeDetail/EmployeeName"
            };
            CommonService.GetListItems(lstEmployeeAttendance).then(function (response) {
                if (response && response.data.d.results.length > 0) {

                    $scope.EditEmployeeAttendance = response.data.d.results[0];
                    $scope.EditEmployeeAttendance.Present = $scope.EditEmployeeAttendance.Present == 1 ? true : false
                }
            });
        };

        $scope.RedirectDashboard = function () {
            $location.path('/EmployeeForAttendanceDashboard');
        };

        $scope.init = function () {

            GlobalVariableService.validateUrl($location.$$path);
            $scope.makeYear();
            if ($scope.ID > 0)
                $scope.GetEmployeeAttendanceById();
            $scope.GetDataForDashboard();
            $scope.GetEmployee();
        };

        $scope.init();
    }]);