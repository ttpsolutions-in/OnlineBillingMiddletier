//Define an angular module for our app 
var ETradersApp = angular.module("ETradersApp", ["ngMaterial", "ngMessages","angular-chartist","ngRoute", "ngAnimate", "ui.bootstrap", "toaster", "ui.grid", "ui.grid.edit", "ui.grid.cellNav", "ui.grid.validate",
    "ui.grid.pagination", "ui.grid.autoResize", "ui.grid.selection", "ui.grid.resizeColumns", "ui.grid.grouping", "mgcrea.ngStrap"]);//;.run(init);
//for autocomplete dropdown
//function init($rootScope, GlobalVariableService) {
//    //ngRoute
//    $rootScope.$on('$routeChangeStart', function (angularEvent, next, current) {
//        GlobalVariableService.validateUrl(current);
//    });

ETradersApp.constant("Config", {
    "ServiceBaseURL": "http://localhost:8080",
    
});//http://ephraim.ttpsolutions.in //http://localhost:50503



ETradersApp.directive("select2", function ($timeout, $parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs) {
            $timeout(function () {
                element.select2();
                element.select2Initialized = true;
            });

            var recreateSelect = function () {
                if (!element.select2Initialized) {
                    return;
                }
                $timeout(function () {
                    element.select2('destroy');
                    element.select2();
                });
            };

            scope.$watch(attrs.ngModel, recreateSelect);

            if (attrs.ngOptions) {
                var list = attrs.ngOptions.match(/ in ([^ ]*)/)[1];
                // watch for option list change
                scope.$watch(list, recreateSelect);
            }

            if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, recreateSelect);
            }
        }
    };
});

//Define Routing for app
ETradersApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true
        });

        $routeProvider.when("/", {
            templateUrl: '/vtemplate/home.html',
            controller: 'homeController'
        }).when("/home", {
                templateUrl: '/vtemplate/home.html',
                controller: 'homeController'
        }).when("/WholeSale", {
            templateUrl: '/vtemplate/WholeSale.html',
            controller: 'ManageWholeSaleController'
        }).when("/WholeSaleDashboard", {
            templateUrl: '/vtemplate/WholeSaleDashboard.html',
            controller: 'WholeSaleDashboardController'
        }).when("/ViewWholeSale/:ID", {
            templateUrl: '/vtemplate/ViewWholeSale.html',
            controller: 'WholeSaleDashboardController'
        }).when("/Dashboard", {
            templateUrl: '/vtemplate/Dashboard.html',
            controller: 'BasicDetailsController'
        }).when("/login", {
            templateUrl: '/vtemplate/login.html',
            controller: 'LoginController'
        }).when("/CreateLogin", {
            templateUrl: 'vtemplate/Register.html',
            controller: 'RegisterController'
        }).when("/AddRetails", {
            templateUrl: '/vtemplate/AddRetails.html',
            controller: 'ManageRetailsController'
        }).when("/SupplierCustomer", {
            templateUrl: '/vtemplate/SupplierCustomerDashboard.html',
            controller: 'SupplierCustomerController'
        }).when("/AddSupplierCustomer", {
            templateUrl: '/vtemplate/AddSupplierCustomer.html',
            controller: 'SupplierCustomerController'
        }).when("/EditSupplierCustomer/:ID", {
            templateUrl: '/vtemplate/EditSupplierCustomer.html',
            controller: 'SupplierCustomerController'
        }).when("/Materials", {
            templateUrl: '/vtemplate/MaterialDashboard.html',
            controller: 'MaterialsController'
        }).when("/AddMaterial", {
            templateUrl: '/vtemplate/AddMaterials.html',
            controller: 'MaterialsController'
        }).when("/EditMaterial/:ID", {
            templateUrl: '/vtemplate/EditMaterials.html',
            controller: 'MaterialsController'
        }).when("/MaterialCategoryDashboard", {
            templateUrl: '/vtemplate/ItemCategoryDashboard.html',
            controller: 'ItemCategoryController'
        }).when("/AddMaterialCategory", {
            templateUrl: '/vtemplate/AddMaterialCategory.html',
            controller: 'ItemCategoryController'
        }).when("/EditMaterialCategory/:ID", {
            templateUrl: '/vtemplate/EditMaterialCategory.html',
            controller: 'ItemCategoryController'
        }).when("/EditBill/:ID", {
            templateUrl: '/vtemplate/EditBill.html',
            controller: 'EditBillController'
        }).when("/GodownDashboard", {
            templateUrl: '/vtemplate/GodownDashboard.html',
            controller: 'GodownController'
        }).when("/AddGodown", {
            templateUrl: '/vtemplate/AddGodown.html',
            controller: 'GodownController'
        }).when("/EditGodown/:ID", {
            templateUrl: '/vtemplate/EditGodown.html',
            controller: 'GodownController'
        }).when("/GSTDashboard", {
            templateUrl: '/vtemplate/GSTDashboard.html',
            controller: 'GSTController'
        }).when("/AddGST", {
            templateUrl: '/vtemplate/AddGST.html',
            controller: 'GSTController'
        }).when("/EditGST/:ID", {
            templateUrl: '/vtemplate/EditGST.html',
            controller: 'GSTController'
        }).when("/InventoryTypeDashboard", {
            templateUrl: '/vtemplate/InventoryTypeDashboard.html',
            controller: 'InventoryTypeController'
        }).when("/AddInventoryType", {
            templateUrl: '/vtemplate/AddInventoryType.html',
            controller: 'InventoryTypeController'
        }).when("/EditInventoryType/:ID", {
            templateUrl: '/vtemplate/EditInventoryType.html',
            controller: 'InventoryTypeController'
        }).when("/AddMaterialInventory", {
            templateUrl: '/vtemplate/AddMaterialInventory.html',
            controller: 'MaterialInventoryController'
        }).when("/EditMaterialInventory/:ID", {
            templateUrl: '/vtemplate/AddMaterialInventory.html',
            controller: 'MaterialInventoryController'
        }).when("/MaterialInventoryDashboard", {
            templateUrl: '/vtemplate/MaterialInventoryDashboard.html',
            controller: 'MaterialInventoryDashboardController'
        }).when("/MaterialsCheckQIH", {
            templateUrl: '/vtemplate/MaterialQIHDashboard.html',
            controller: 'MaterialsCheckQIHController'
        }).when("/EmployeeDashboard", {
            templateUrl: '/vtemplate/EmployeesDashboard.html',
            controller: 'EmployeesController'    
        }).when("/AddEmployee", {
            templateUrl: '/vtemplate/AddEmployee.html',
            controller: 'EmployeesController'    
        }).when("/EditEmployee/:ID", {
            templateUrl: '/vtemplate/EditEmployeeDetail.html',
            controller: 'EmployeesController'    
        }).when("/EditEmployeeAccount/:ID", {
            templateUrl: '/vtemplate/EditEmployeeAccount.html',
            controller: 'EmployeeAccountController'    
        }).when("/PayEmployee", {
            templateUrl: '/vtemplate/AddEmployeeAccount.html',
            controller: 'EmployeeAccountController'    
        }).when("/EmployeeAccountDashboard", {
            templateUrl: '/vtemplate/EmployeeAccountDashboard.html',
            controller: 'EmployeeAccountController'
        }).when("/EditRights/:ID", {
            templateUrl: '/vtemplate/EditRights.html',
            controller: 'RightsController'
        }).when("/AddRights", {
            templateUrl: '/vtemplate/AddRights.html',
            controller: 'RightsController'
        }).when("/RightsDashboard", {
            templateUrl: '/vtemplate/RightsDashboard.html',
            controller: 'RightsController'
        }).when("/EditRightsManagement/:ID", {
            templateUrl: '/vtemplate/EditRightsManagement.html',
            controller: 'RightsManagementController'
        }).when("/AddRightsManagement", {
            templateUrl: '/vtemplate/AddRightsManagement.html',
            controller: 'RightsManagementController'
        }).when("/RightsManagementDashboard", {
            templateUrl: '/vtemplate/RightsManagementDashboard.html',
            controller: 'RightsManagementController'
        }).when("/ChangePassword", {
            templateUrl: '/vtemplate/ChangePassword.html',
            controller: 'RegisterController'
        }).when("/Statistics", {
            templateUrl: '/vtemplate/SalesStatistics.html',
            controller: 'StatisticsController'            
        }).when("/AddOnlinePaymentDetailWebHook", {
            templateUrl: '/vtemplate/AddOnlinePayment.html',
            controller: 'OnlinePaymentDetailFromWebHookController'
        }).when("/EditOnlinePaymentDetail/:ID", {
            templateUrl: '/vtemplate/EditOnlinePayment.html',
            controller: 'OnlinePaymentDetailFromWebHookController'            
        }).when("/OnlinePaymentDetailDashboard", {
            templateUrl: '/vtemplate/OnlinePaymentDashboard.html',
            controller: 'OnlinePaymentDetailFromWebHookController'
        }).when("/PaymentOnline", {
            templateUrl: '/vtemplate/PaymentForm.html',
            controller: 'PaymentOnlineController'
        }).when("/DailyReportChart", {
            templateUrl: '/vtemplate/DailyReportChart.html',
            controller: 'ChartController'
        }).when("/EmployeeAttendance", {
            templateUrl: '/vtemplate/EmployeeAttendanceDashboard.html',
            controller: 'EmployeeAttendanceController'
        }).when("/EmployeeAttendanceReport", {
            templateUrl: '/vtemplate/EmployeeAttendanceReport.html',
            controller: 'EmployeeAttendanceController'
        }).when("/invalid", {
            templateUrl: '/vtemplate/InvalidPage.html',
            controller: ''
        });

        
        ////delete $httpProvider.defaults.headers.common['X-Requested-With'];

        //var interceptor = ['$rootScope', '$q', "Base64", function (scope, $q, Base64) {
        //    function success(response) {
        //        return response;
        //    }
        //    function error(response) {
        //        var status = response.status;
        //        if (status == 401) {
        //            //AuthFactory.clearUser();
        //            window.location = "/account/login?redirectUrl=" + Base64.encode(document.URL);
        //            return;
        //        }
        //        // otherwise
        //        return $q.reject(response);
        //    }
        //    return function (promise) {
        //        return promise.then(success, error);
        //    }
        //}];
        //$httpProvider.responseInterceptors.push(interceptor);
        
    }]);


