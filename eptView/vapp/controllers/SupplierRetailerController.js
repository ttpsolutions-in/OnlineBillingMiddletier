ETradersApp.controller("SupplierCustomerController", ['GlobalVariableService','$scope', '$filter', '$http', '$location', '$routeParams', '$timeout', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService,$scope, $filter, $http, $location, $routeParams, $timeout, toaster, CommonService, uiGridConstants) {

    $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
    $scope.ID = $routeParams.ID;
    $scope.Categories = [];
    $scope.SupplierCustomersList = [];
    $scope.EditSupplierCustomer = {};
    $scope.Types = [];
    $scope.submitted = false;


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
           
            { name: 'No.', field: 'SrNo', width: 50, visible: true, enableFiltering: false, enableSorting: true, headerCellClass: 'text-right', cellClass: 'text-right', displayName: '#', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+(grid.options.paginationPageSize*(grid.options.paginationCurrentPage-1))+1}}</div>' },
            { displayName: 'Name', field: 'Name', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { displayName: 'Contact', field: 'Contact', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { displayName: 'Email', field: 'Email', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { displayName: 'Address', field: 'Address', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { displayName: 'Category', field: 'Category1.CategoryName', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { displayName: 'Type', field: 'SupplierRetailType.TypeName', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            {
                name: 'Action', width: 120, enableFiltering: false, displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                    + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditSupplierCustomer/{{row.entity.SupplierRetailerId}}" ><span data-feather="edit"></span> </a>'
                    + '</div><script>feather.replace()</script>'
            },

        ],
        data: []

    };

    $scope.SaveSupplierCustomers = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.SupplierCustomersList, { Name: $scope.SupplierCustomer.Name }, true);
                if (duplicate != undefined && duplicate.length > 0) {
                    toaster.pop('error', "", "Supplier/Customer already exists!", 5000, 'trustedHtml');
                }
                else {
                    var supplierCustomers = {
                        "Name": $scope.SupplierCustomer.Name,
                        "Address": $scope.SupplierCustomer.Address,
                        "Email": $scope.SupplierCustomer.Email,
                        "Contact": $scope.SupplierCustomer.ContactNo,
                        "Type": $scope.SupplierCustomer.Type,
                        "Category": $scope.SupplierCustomer.Category,
                        "CreatedOn": new Date()
                    };
                    CommonService.PostData("SupplierRetailers", supplierCustomers).then(function (response) {
                        console.log("response " + response);
                        if (response.SupplierRetailerId > 0) {
                            toaster.pop('success', "", "Supplier/Customer Saved Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the SaveSupplierCustomers function. Exception Logged as " + error.message);
        }
    };

    //Update Supplier Customers
    $scope.UpdateSupplierCustomers = function (isFormValid) {
        try {
            var isValid = isFormValid;
            $scope.submitted = !isValid;
            if (isValid) {
                var duplicate = $filter('filter')($scope.SupplierCustomersList, function (value, key) {
                    if (value.Name.toUpperCase() == $scope.EditSupplierCustomer.Name.toUpperCase() && value.SupplierRetailerId != $scope.ID)
                        return true;
                });
                if (duplicate != undefined && duplicate.length > 0)
                    toaster.pop('error', "", "Supplier/Customer already exists!", 5000, 'trustedHtml');
                else {

                    var supplierCustomers = {
                        "Name": $scope.EditSupplierCustomer.Name,
                        "Address": $scope.EditSupplierCustomer.Address,
                        "Email": $scope.EditSupplierCustomer.Email,
                        "Contact": $scope.EditSupplierCustomer.Contact,
                        "Type": $scope.EditSupplierCustomer.Type,
                        "Category": $scope.EditSupplierCustomer.Category,
                        "UpdatedOn": new Date()
                    };
                    CommonService.UpdateData("SupplierRetailers", supplierCustomers, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Supplier/Customer Updated Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            }
        } catch (error) {
            console.log("Exception caught in the SaveSupplierCustomers function. Exception Logged as " + error.message);
        }
    };
    
    $scope.GetSupplierCustomers = function () {
        var lstBill = {
            title: "SupplierRetailers",
            fields: ["*", "Category1/Id", "Category1/CategoryName","SupplierRetailType/TypeName"],
            lookupFields: ["Category1","SupplierRetailType"],
            orderBy: "CreatedOn desc"
        };
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.SupplierCustomersList = response.data.d.results;
                $scope.gridOptions.data = $scope.SupplierCustomersList;
            }
        });
    };

    $scope.GetSupplierCustomersById = function () {
        var lstBill = {
            title: "SupplierRetailers",
            fields: ["*"], //"Category/Id", "Category/CategoryName"
            filter: ["SupplierRetailerId eq " + $scope.ID],
            orderBy: "CreatedOn desc"
        };
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.EditSupplierCustomer = response.data.d.results[0];
            }
        });
    };


    $scope.GetCategories = function () {
        var lstBill = {
            title: "Categories",
            fields: ["*"]
        };
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.Categories = response.data.d.results;
            }
        });
    };

    $scope.GetSupplierCustomerTypes = function () {
        var values = {
            title: "SupplierRetailTypes",
            fields: ["*"]
        };
        CommonService.GetListItems(values).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.Types = response.data.d.results;
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/SupplierCustomer');
    };

    $scope.init = function () {

        GlobalVariableService.validateUrl($location.$$path);

        $scope.GetCategories();
        $scope.GetSupplierCustomerTypes();
        $scope.GetSupplierCustomersById();
        $scope.GetSupplierCustomers();
        
    };

    $scope.init();
}]);