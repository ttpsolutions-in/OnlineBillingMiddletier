ETradersApp.controller("EmployeeAccountController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.TotalPreviousAdvance = 0;
        $scope.TotalPreviousSalary = 0;
        $scope.TotalCarryForwardFromPreviousMonth = 0;
        $scope.TotalAdvance = 0;
        $scope.TotalSalary = 0;
        $scope.TotalBalance = 0;

        $scope.TodaysDate = $filter('date')(new Date(), "dd-MM-yyyy");
        //$scope.EmployeeAccount.PaymentDate = $scope.TodaysDate;
        $scope.ID = $routeParams.ID;
        $scope.EmployeeAccountList = [];
        $scope.EmployeeList = [];
        $scope.EditEmployeeAccount = {};
        $scope.EmployeeAccount = {
            "EmpAccountId": null
            , "EmployeeNo": null
            , "Amount": null
            , "PaymentType": null
            , "PaymentDate": null
            , "Remarks": ''

        }
        $scope.EmployeeAccount.PaymentDate = new Date();//$scope.TodaysDate;
        $scope.submitted = false;
        //$scope.ItemCatogoryList = [];

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


                { width: 100, displayName: 'Employee No.', field: 'EmployeeNo', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { width: 250, displayName: 'Name', field: 'EmployeeDetail.EmployeeName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                {
                    width: 250, displayName: 'Amount', field: 'Amount', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-right',
                    headerCellClass: 'text-center'
                },
                { width: 150, displayName: 'Payment Type', field: 'PaymentType1.PaymentTypeName', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                {
                    width: 100, displayName: 'Date', field: 'PaymentDate', enableCellEdit: false,
                    type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center'
                },
                { width: 100, displayName: 'Remarks', field: 'Remarks', enableCellEdit: false, cellTooltip: true, headerCellClass: 'text-center' },
                {
                    name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditEmployeeAccount/{{row.entity.EmployeeNo}}" ><span data-feather="edit"></span> </a>'
                        + '</div><script>feather.replace()</script>'
                },
                { displayName: 'EmpAccountId', field: 'EmpAccountId', enableCellEdit: false, visible: false }

            ],
            data: []
        };

        $scope.SaveEmployeeAccounts = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;

                if (isValid) {
                    var values = {
                        "EmployeeNo": $scope.EmployeeAccount.EmployeeNo
                        , "Amount": $scope.EmployeeAccount.Amount.toString()
                        , "PaymentType": $scope.EmployeeAccount.PaymentType
                        , "PaymentDate": $filter('date')($scope.EmployeeAccount.PaymentDate, 'yyyy-MM-dd')
                        , "Remarks": $scope.EmployeeAccount.Remarks.toString()
                    };
                    CommonService.PostData("EmployeeAccounts", values).then(function (response) {
                        console.log("response " + response);
                        if (response.EmployeeNo > 0) {
                            toaster.pop('success', "", "Employee Account Detail Saved Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            } catch (error) {
                console.log("Exception caught in the Save employee Account detail function. Exception Logged as " + error.message);
            }
        };

        //Update Employees
        $scope.UpdateEmployeeAccounts = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;

                if (isValid) {
                    var values = {
                        "EmployeeNo": $scope.EditEmployeeAccount.EmployeeNo
                        , "Amount": $scope.EditEmployeeAccount.Amount.toString()
                        , "PaymentType": $scope.EditEmployeeAccount.PaymentType
                        , "PaymentDate": $filter('date')($scope.EditEmployeeAccount.PaymentDate, 'yyyy-MM-dd')
                        , "Remarks": $scope.EditEmployeeAccount.Remarks.toString()
                    };
                    CommonService.UpdateData("EmployeeAccounts", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Employee Account Data Updated Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            } catch (error) {
                console.log("Exception caught in the update employee Account function. Exception Logged as " + error.message);
            }
        };

        $scope.GetPaymentTypes = function (callback) {
            var postData = {
                title: "PaymentTypes",
                fields: ["*"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.PaymentTypes = response.data.d.results;
                }
                callback();
            });
        };
        $scope.GetDataForDashboard = function () {
            $scope.EmployeeAccountList = [];
            var lstEmployeeAccount = {
                title: "EmployeeAccounts",
                fields: ["*","EmployeeDetail/EmployeeName","PaymentType1/PaymentTypeName"],
                lookupFields: ["EmployeeDetail","PaymentType1"],
                //filter:[" eq 1"],
                limitTo: 20,
                orderBy: "EmployeeDetail/EmployeeName"
            };
            if ($scope.searchEmployeeName != undefined && $scope.searchEmployeeName !== '') {
                lstEmployeeAccount.filter = "indexof(EmployeeDetail/EmployeeName,'" + $scope.searchEmployeeName + "') gt -1";
            }

            $scope.showSpinner();
            CommonService.GetListItems(lstEmployeeAccount).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeAccountList = response.data.d.results;
                    var todayMonth = new Date().getMonth();
                    $scope.TotalPreviousAdvance = 0;
                    $scope.TotalPreviousSalary = 0;
                    $scope.TotalAdvance = 0;
                    $scope.TotalSalary = 0;
                    $scope.TotalCarryForwardFromPreviousMonth = 0;

                    angular.forEach($scope.EmployeeAccountList, function (value, key) {
                        var PaymentDateMonth = new Date(value.PaymentDate).getMonth();
                        if (value.PaymentType1.PaymentTypeName == "Advance") {
                            if (PaymentDateMonth < todayMonth) {
                                $scope.TotalPreviousAdvance += parseFloat(value.Amount);
                            }
                            else
                                $scope.TotalAdvance += parseFloat(value.Amount);
                        }
                        else {
                            if (PaymentDateMonth < todayMonth) {
                                $scope.TotalPreviousSalary += parseFloat(value.Amount);
                            }
                            else
                                $scope.TotalSalary += parseFloat(value.Amount);
                        }
                    })
                    $scope.TotalCarryForwardFromPreviousMonth = parseFloat($scope.TotalPreviousSalary) - parseFloat($scope.TotalPreviousAdvance)
                    $scope.TotalBalance = ($scope.TotalCarryForwardFromPreviousMonth + $scope.TotalSalary) - $scope.TotalAdvance
                }
                else {
                    $scope.EmployeeAccountList = [];

                }
                $scope.gridOptions.data = $scope.EmployeeAccountList;
                //$scope.hideSpinner();
            });
        };
        $scope.GetEmployeeDetails = function (callback) {
            var lstEmployment = {
                title: "EmployeeDetails",
                fields: ["EmployeeNo,EmployeeName,Salary"],//,"ItemCategory/ItemCategoryName"],
                filter: ["Active eq 1"]
                //lookupFields: ["ItemCategory"],

            };
            CommonService.GetListItems(lstEmployment).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeList = response.data.d.results;
                    //$scope.gridOptions.data = $scope.MaterialList;
                    //$scope.hideSpinner()
                    if (callback)
                        callback();
                }

            });
        };

        $scope.GetEmployeeAccountById = function () {
            var lstBill = {
                title: "EmployeeAccounts",
                fields: ["*","EmployeeDetail/EmployeeName","PaymentType1/PaymentTypeName"],
                filter: ["EmpAccountId eq " + $scope.ID],
                lookupFields: ["EmployeeDetail","PaymentType1"],
                orderBy: "EmployeeDetail/EmployeeName"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {

                    $scope.EditEmployeeAccount = response.data.d.results[0];
                    if ($scope.EditEmployeeAccount.PaymentDate != null) {
                        var paymentDate = new Date($scope.EditEmployeeAccount.PaymentDate);
                        $scope.EditEmployeeAccount.PaymentDate = paymentDate;
                    }
                    $scope.EditEmployeeAccount.Amount = parseInt(Math.trunc($scope.EditEmployeeAccount.Amount));
                    if ($scope.EditEmployeeAccount.PaymentDate == null)
                        $scope.EditEmployeeAccount.PaymentDate = $scope.TodaysDate;
                }
            });
        };

        $scope.RedirectDashboard = function () {
            $location.path('/EmployeeAccountDashboard');
        };

        $scope.init = function () {
            GlobalVariableService.validateUrl($location.$$path);
            $scope.GetEmployeeDetails(function () {
                $scope.GetPaymentTypes(function () {
                    if ($scope.ID > 0) {
                        $scope.GetEmployeeAccountById();
                    }
                    else {
                        $scope.GetDataForDashboard();
                    }
                });
            });
            };

            $scope.init();
        }]);