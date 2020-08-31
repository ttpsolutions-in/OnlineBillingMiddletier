//Define an angular module for our app 
var ETradersApp = angular.module("ETradersApp", ["ngRoute", "ngAnimate", "ui.bootstrap", "toaster", "ui.grid", "ui.grid.edit", "ui.grid.cellNav", "ui.grid.validate", "ui.grid.pagination", "ui.grid.autoResize", "ui.grid.selection", "ui.grid.resizeColumns", "ui.grid.grouping", "mgcrea.ngStrap"]);
//for autocomplete dropdown

ETradersApp.constant("serviceBaseURL", "http://localhost:8080");//http://ephraim.ttpsolutions.in //http://localhost:50503




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
            templateUrl: '/vtemplate/WholeSaleDashboard.html',
            controller: 'WholeSaleDashboardController'
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
        }).when("/Register", {
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
        }).when("/ItemCategoryDashboard", {
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
        }).when("/AddMaterialInventory", {
            templateUrl: '/vtemplate/AddMaterialInventory.html',
            controller: 'MaterialInventoryController'
        });
       

    }]);


