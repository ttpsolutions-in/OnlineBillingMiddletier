ETradersApp.controller("EmployeesController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }
        $scope.searchCategory = '';
        $scope.searchDisplayName = '';
        $scope.searchDescription = '';

        $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.ID = $routeParams.ID;
        $scope.EmployeeList = [];
        $scope.EditEmployee = {};
        $scope.Employee = {
            "EmployeeName": ''
            , "Address": ''
            , "ContactNo": ''
            , "Email": ''
            , "Designation": 0
            , "DOB": null
            , "Salary": 0
            , "BloodGroup": ''
            , "EmploymentType1": 0
            , "EmployeeNo": 0
            , "JoinDate": null
            , "EmpRoleId": 0
            , "Active": 1

        }
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

                { width: 150, displayName: 'Employee No.', field: 'EmployeeNo', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { width: 250, displayName: 'Name', field: 'EmployeeName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                {
                    width: 250, displayName: 'Address', field: 'Address', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left',
                    headerCellClass: 'text-center'
                },
                { width: 150, displayName: 'Contact No', field: 'ContactNo', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { width: 200, displayName: 'Email', field: 'Email', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                //{ width: 100, displayName: 'Designation', field: 'EmployeeDesignation.Designation', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 80, displayName: 'DOB', field: 'DOB', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 80, displayName: 'Salary', field: 'Salary', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 80, displayName: 'Blood Group', field: 'BloodGroup', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 100, displayName: 'Join Date', field: 'JoinDate', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 100, displayName: 'Employment Type', field: 'EmploymentType.EmploymentTypeName', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },

                { width: 80, displayName: 'Role', field: 'EmployeeRole.RoleName', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                {
                    name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditEmployee/{{row.entity.EmployeeNo}}" ><span data-feather="edit"></span> </a>'
                        + '</div><script>feather.replace()</script>'
                },
            ],
            data: []
        };

        $scope.SaveEmployees = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;

                if (isValid) {
                    var duplicate = $filter('filter')($scope.EmployeeList, { EmployeeName: $scope.Employee.EmployeeName }, true);      
                    if (duplicate != undefined && duplicate.length > 0) {
                        toaster.pop('error', "", "Employee name already exists!", 10000, 'trustedHtml');
                    }
                    else {
                        var values = {
                            "EmployeeName": $scope.Employee.EmployeeName.toString()
                            , "Address": $scope.Employee.Address.toString()
                            , "ContactNo": $scope.Employee.ContactNo.toString()
                            , "Email": $scope.Employee.Email.toString()
                            , "DesignationId": $scope.Employee.DesignationId === 0 ? null : $scope.Employee.DesignationId
                            , "DOB": $scope.Employee.DOB
                            , "Salary": $scope.Employee.Salary
                            , "BloodGroup": $scope.Employee.BloodGroup.toString()
                            , "EmploymentTypeId": $scope.Employee.EmploymentTypeId === 0 ? null : $scope.Employee.EmploymentTypeId
                            , "JoinDate": $scope.Employee.JoinDate
                            , "EmpRoleId": $scope.Employee.EmpRoleId === 0 ? null : $scope.Employee.EmpRoleId
                            , "Active": 1

                        };
                        CommonService.PostData("EmployeeDetails", values).then(function (response) {
                            console.log("response " + response);
                            if (response.EmployeeNo > 0) {
                                toaster.pop('success', "", "Employee Detail Saved Successfully", 5000, 'trustedHtml');
                                $scope.RedirectDashboard();
                            }
                        }, function (data) {
                            console.log(data);
                        });
                    }
                }
            } catch (error) {
                console.log("Exception caught in the Save employee detail function. Exception Logged as " + error.message);
            }
        };

        //Update Employees
        $scope.UpdateEmployees = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;

                if (isValid) {
                    var duplicate = 0;
                    
                    angular.forEach($scope.EmployeeList, function (value, key) {
                        if (value.EmployeeName == $scope.EditEmployee.EmployeeName && value.EmployeeNo != $scope.ID) {
                            duplicate = 1;
                            return;
                        }
                    });

                    if (duplicate == 1) {
                        toaster.pop('error', "", "Employee name already exists!", 10000, 'trustedHtml');
                    }
                    else {
                        var values = {
                            "EmployeeName": $scope.EditEmployee.EmployeeName.toString()
                            , "Address": $scope.EditEmployee.Address.toString()
                            , "ContactNo": $scope.EditEmployee.ContactNo.toString()
                            , "Email": $scope.EditEmployee.Email.toString()
                            , "DesignationId": $scope.EditEmployee.DesignationId
                            , "DOB": $scope.EditEmployee.DOB
                            , "Salary": $scope.EditEmployee.Salary
                            , "BloodGroup": $scope.EditEmployee.BloodGroup.toString()
                            , "EmploymentTypeId": $scope.EditEmployee.EmploymentTypeId
                            , "JoinDate": $scope.EditEmployee.JoinDate
                            , "EmpRoleId": $scope.EditEmployee.EmpRoleId
                            , "Active": 1
                        };
                        CommonService.UpdateData("EmployeeDetails", values, $scope.ID).then(function (response) {
                            console.log("response " + response);
                            if (response != undefined) {
                                toaster.pop('success', "", "Employee Data Updated Successfully", 5000, 'trustedHtml');
                                $scope.RedirectDashboard();
                            }
                        }, function (data) {
                            console.log(data);
                        });
                    }
                }
            } catch (error) {
                console.log("Exception caught in the update employee function. Exception Logged as " + error.message);
            }
        };

        $scope.GetEmployeeRoles = function (callback) {
            var postData = {
                title: "EmployeeRoles",
                fields: ["*"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeRoles = response.data.d.results;
                }
                callback();
            });
        };
        $scope.GetDataForDashboard = function () {
            $scope.EmployeeList = [];
            var lstEmployee = {
                title: "EmployeeDetails",
                fields: ["*", "EmployeeRole/RoleName", "EmployeeDesignation/Designation", "EmploymentType/EmploymentTypeName"],
                lookupFields: ["EmployeeRole", "EmploymentType", "EmployeeDesignation"],
                //filter:[" eq 1"],
                limitTo: 20,
                orderBy: "EmployeeName"
            };
            if ($scope.searchEmployeeName != undefined && $scope.searchEmployeeName !== '') {
                lstEmployee.filter = "indexof(EmployeeName,'" + $scope.searchEmployeeName + "') gt -1";
            }

            $scope.showSpinner();
            CommonService.GetListItems(lstEmployee).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeList = response.data.d.results;

                }
                else {
                    $scope.EmployeeList = [];

                }
                $scope.gridOptions.data = $scope.EmployeeList;
                $scope.hideSpinner();
            });
        };
        $scope.GetEmploymentTypes = function (callback) {
            var lstEmploymentTypes = {
                title: "EmploymentTypes",
                fields: ["*"]//,//,"ItemCategory/ItemCategoryName"],
                //lookupFields: ["ItemCategory"],

            };


            CommonService.GetListItems(lstEmploymentTypes).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmploymentTypes = response.data.d.results;
                    //$scope.gridOptions.data = $scope.MaterialList;
                    $scope.hideSpinner()
                    if (callback)
                        callback();
                }

            });
        };
        $scope.GetEmployeeDesignation = function (callback) {
            var lstEmployeeDesignation = {
                title: "EmployeeDesignations",
                fields: ["*"]//,//,"ItemCategory/ItemCategoryName"],
                //lookupFields: ["ItemCategory"],

            };

            CommonService.GetListItems(lstEmployeeDesignation).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeDesignations = response.data.d.results;
                    //$scope.gridOptions.data = $scope.MaterialList;
                    //$scope.hideSpinner()
                    if (callback)
                        callback();
                }

            });
        };
        $scope.GetEmployeeRole = function (callback) {
            var lstEmployeeRole = {
                title: "EmployeeRoles",
                fields: ["*"]//,//,"ItemCategory/ItemCategoryName"],
                //lookupFields: ["ItemCategory"],

            };

            CommonService.GetListItems(lstEmployeeRole).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EmployeeRoles = response.data.d.results;
                    //$scope.gridOptions.data = $scope.MaterialList;
                    $scope.hideSpinner()
                    if (callback)
                        callback();
                }

            });
        };

        $scope.GetEmployeeById = function () {
            var lstBill = {
                title: "EmployeeDetails",
                fields: ["*"],
                filter: ["EmployeeNo eq " + $scope.ID],
                orderBy: "EmployeeName"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {

                    $scope.EditEmployee = response.data.d.results[0];
                    if ($scope.EditEmployee.JoinDate != null) {
                        var joinDate = new Date($scope.EditEmployee.JoinDate);
                        $scope.EditEmployee.JoinDate = joinDate;
                    }
                    if ($scope.EditEmployee.DOB != null) {
                        var DOB = new Date($scope.EditEmployee.DOB);
                        $scope.EditEmployee.DOB = DOB;
                    }
                    $scope.EditEmployee.Amount = parseInt(Math.trunc($scope.EditEmployee.Amount));
                }
            });
        };

        $scope.RedirectDashboard = function () {
            $location.path('/EmployeeDashboard');
        };

        $scope.init = function () {
            GlobalVariableService.validateUrl($location.$$path);

            $scope.GetEmployeeRole(function () {
                $scope.GetEmployeeDesignation(function () {
                    $scope.GetEmploymentTypes(function () {

                        if ($scope.ID > 0) { $scope.GetEmployeeById() };

                        $scope.GetDataForDashboard();
                    });
                });
            });
        };

        $scope.init();
    }]);