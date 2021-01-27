//import { trim } from "jquery";

ETradersApp.controller("MaterialsController", ['GlobalVariableService', '$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
    function (GlobalVariableService, $scope, $filter, $http, $location, $routeParams, toaster, CommonService, uiGridConstants) {
        $scope.ShowSpinnerStatus = false;

        $scope.showSpinner = function () {
            $scope.ShowSpinnerStatus = true;
        }
        $scope.hideSpinner = function () {
            $scope.ShowSpinnerStatus = false;
        }

        $scope.searchCategory = null;
        $scope.searchCategory = null;
        $scope.searchDisplayName = '';
        $scope.searchDescription = '';

        $scope.TodaysDate = $filter('date')(new Date(), "dd/MM/yyyy");
        $scope.ID = $routeParams.ID;
        $scope.MaterialList = [];
        $scope.EditMaterial = {};
        $scope.submitted = false;
        //$scope.ItemCatogoryList = [];
        $scope.Material = {
            ItemCategoryId: null
            , CategoryName: ''
            , Description: ''
            , Product: ''
            , Model: ''
            , Size1: ''
            //, Size2: ''
            //, StdPkg: 0
            //, BoxQty: 0
            , Remarks: ''
            , RateUnit: 0
            , WholeSaleRate: 0
            , RetailRate: 0
            , ReorderLevel: 0
            , CostingPrice: 0
            , Active: true
        };
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

                { name: 'No.', field: 'SrNo', width: 50, visible: false, enableFiltering: false, enableSorting: true, headerCellClass: 'text-right', cellClass: 'text-right', displayName: '#', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+(grid.options.paginationPageSize*(grid.options.paginationCurrentPage-1))+1}}</div>' },
                { width: 300, displayName: 'Material Name', field: 'DisplayName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
                { width: 150, displayName: 'Category', field: 'ItemCategory.ItemCategoryName', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { width: 250, displayName: 'Description', field: 'Description', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { width: 150, displayName: 'Model', field: 'Model', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
                { width: 150, displayName: 'Size/Weight', field: 'Size1', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 80, displayName: 'Rate Unit', field: 'RateUnit', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 80, displayName: 'Std Pkg', field: 'StdPkg', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 80, displayName: 'Box Qty', field: 'BoxQty', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 100, displayName: 'Retail Rate', field: 'RetailRate', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 100, displayName: 'Whole Sale Rate', field: 'WholeSaleRate', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 100, displayName: 'Costing Price', field: 'CostingPrice', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 80, displayName: 'QIH', field: 'QuantityInHand', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                //{ width: 100, displayName: 'Reorder Level', field: 'ReorderLevel', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                { width: 80, displayName: 'Active', field: 'Active', enableCellEdit: false, enableFiltering: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
                {
                    name: 'Action', width: 80, enableFiltering: false, cellClass: 'text-center', displayName: 'Action', cellTemplate: '<div class="ui-grid-cell-contents">'
                        + '<a id="btnView" type="button" title="Edit" style="line-height: 0.5;" class="btn btn-primary btn-xs" href="#EditMaterial/{{row.entity.MaterialId}}" ><span data-feather="edit"></span> </a>'
                        + '</div><script>feather.replace()</script>'
                },
            ],
            data: []
        };

        $scope.SaveMaterials = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;
                var strItemCategoryName = $filter('filter')($scope.ItemCatogoryList, { ItemCategoryId: $scope.Material.ItemCategoryId }, true)[0].ItemCategoryName; //$scope.Material.ItemCategory.ItemCategoryName;
                var strItemDescription = $scope.Material.Description;

                if (isValid) {
                    var displayName = '';
                    var size = $scope.Material.Size1;
                    if (size.trim().length === 0 && $scope.Material.Model.length === 0) {
                        toaster.pop('error', "", "Either Model or Size1 is required", 5000, 'trustedHtml');
                        return;
                    }
                    if ($scope.Material.DisplayName===undefined || $scope.Material.DisplayName.length == 0) {
                        // if (size.trim().length == 0)
                        displayName = strItemCategoryName + ' ' + $scope.Material.Model + ' ' + size;
                        //else
                        //    displayName = strItemCategoryName.substring(0, strItemCategoryName.indexOf(' ')) + '-' + strItemDescription.substring(0, strItemDescription.indexOf(' ')) + ' ' + size;
                    }
                    else {
                        displayName = $scope.Material.DisplayName;
                    }
                    var values = {
                        "Description": $scope.Material.Description
                        //, "Unit": $scope.Material.Unit
                        //, "NoOfPiecePerUnit": $scope.Material.NoOfPiecePerUnit.toString()
                        , "RetailRate": $scope.Material.RetailRate.toString()
                        , "WholeSaleRate": $scope.Material.WholeSaleRate.toString()
                        , "CostingPrice": $scope.Material.CostingPrice.toString()
                        //, "QuantityInHand": $scope.Material.QuantityInHand.toString()
                        , "ReorderLevel": $scope.Material.ReorderLevel.toString()
                        , "CreatedOn": new Date()
                        , "Product": ''
                        , "Model": $scope.Material.Model.toString()
                        , "Size1": $scope.Material.Size1.toString()
                        //, "Size2": $scope.Material.Size2.toString()
                        //, "StdPkg": $scope.Material.StdPkg.toString()
                        //, "BoxQty": $scope.Material.BoxQty.toString()
                        , "ItemCategoryId": $scope.Material.ItemCategoryId
                        , "DisplayName": displayName
                        , "Remarks": $scope.Remarks
                        , "RateUnitId": $scope.RateUnitId
                        , "Active": $scope.Material.Active == true ? '1' : '0'
                    };
                    CommonService.PostData("Materials", values).then(function (response) {
                        //console.log("response " + response);
                        if (response.MaterialId > 0) {
                            toaster.pop('success', "", "Material Saved Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            } catch (error) {
                console.log("Exception caught in the SaveSupplierRetailers function. Exception Logged as " + error.message);
            }
        };

        //Update Materials
        $scope.UpdateMaterials = function (isFormValid) {
            try {
                var isValid = isFormValid;
                $scope.submitted = !isValid;
                var strItemCategoryName = $filter('filter')($scope.ItemCatogoryList, { ItemCategoryId: $scope.EditMaterial.ItemCategoryId }, true)[0].ItemCategoryName;
                var strItemDescription = $scope.EditMaterial.Description;
                var displayName = '';
                var size = $scope.EditMaterial.Size1; // + $scope.EditMaterial.Size2;
                if (size.trim().length === 0 && $scope.EditMaterial.Model.length === 0) {
                    toaster.pop('error', "", "Either Model or Size1 is required", 5000, 'trustedHtml');
                    return;
                }
                if ($scope.EditMaterial.DisplayName===undefined || $scope.EditMaterial.DisplayName.length == 0) {
                    // if (size.trim().length == 0)
                    displayName = strItemCategoryName + ' ' + $scope.EditMaterial.Model + ' ' + size;
                    //else
                    //    displayName = strItemCategoryName.substring(0, strItemCategoryName.indexOf(' ')) + '-' + strItemDescription.substring(0, strItemDescription.indexOf(' ')) + ' ' + size;
                }
                else {
                    displayName = $scope.EditMaterial.DisplayName;
                }

                //if (size.trim().length == 0)
                //    displayName = strItemCategoryName.substring(0, strItemCategoryName.indexOf(' ')) + '-' + strItemDescription.substring(0, strItemDescription.indexOf(' ')) + ' ' + $scope.EditMaterial.Model
                //else
                //    displayName = strItemCategoryName.substring(0, strItemCategoryName.indexOf(' ')) + '-' + strItemDescription.substring(0, strItemDescription.indexOf(' ')) + ' ' + size;

                if (isValid) {
                    var values = {
                        "Description": $scope.EditMaterial.Description
                        , "RetailRate": $scope.EditMaterial.RetailRate.toString()
                        , "WholeSaleRate": $scope.EditMaterial.WholeSaleRate.toString()
                        , "CostingPrice": $scope.EditMaterial.CostingPrice.toString()
                        //, "QuantityInHand": $scope.EditMaterial.QuantityInHand.toString()
                        , "ReorderLevel": $scope.EditMaterial.ReorderLevel.toString()
                        , "UpdatedOn": new Date()
                        , "Product": '' //$scope.EditMaterial.Product.toString()
                        , "Model": $scope.EditMaterial.Model.toString()
                        , "Size1": $scope.EditMaterial.Size1.toString()
                        //, "Size2": $scope.EditMaterial.Size2.toString()
                        //, "StdPkg": $scope.EditMaterial.StdPkg.toString()
                        //, "BoxQty": $scope.EditMaterial.BoxQty.toString()
                        , "ItemCategoryId": $scope.EditMaterial.ItemCategoryId
                        , "DisplayName": displayName
                        , "Remarks": $scope.Remarks
                        , "RateUnitId": $scope.EditMaterial.RateUnitId
                        , "Active": $scope.EditMaterial.Active == true ? '1' : '0'
                    };
                    CommonService.UpdateData("Materials", values, $scope.ID).then(function (response) {
                        console.log("response " + response);
                        if (response != undefined) {
                            toaster.pop('success', "", "Material Data Updated Successfully", 5000, 'trustedHtml');
                            $scope.RedirectDashboard();
                        }
                    }, function (data) {
                        console.log(data);
                    });
                }
            } catch (error) {
                console.log("Exception caught in the SaveSupplierRetailers function. Exception Logged as " + error.message);
            }
        };

        $scope.GetItemCategory = function (callback) {
            var postData = {
                title: "ItemCategories",
                fields: ["*"]
            };
            CommonService.GetListItems(postData).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.ItemCatogoryList = response.data.d.results;
                }
                callback();
            });
        };
        $scope.GetDataForDashboard = function () {
            $scope.WholeSaleList = [];
            var lstMaterial = {
                title: "Materials",
                fields: ["*", "ItemCategory/ItemCategoryName", "Unit/UnitName"],
                lookupFields: ["ItemCategory", "Unit"],
                filter: ["1 eq 1"],
                limitTo: 20,
                orderBy: "CreatedOn desc"
            };
            if ($scope.searchDisplayName !== '') {
                lstMaterial.filter = lstMaterial.filter + " and indexof(DisplayName,'" + $scope.searchDisplayName + "') gt -1";
            }
            if ($scope.searchDescription !== '') {
                lstMaterial.filter = lstMaterial.filter + " and indexof(Description,'" + $scope.searchDescription + "') gt -1";
            }
            if ($scope.searchCategory > 0) {
                lstMaterial.filter = lstMaterial.filter + " and ItemCategoryId eq " + $scope.searchCategory;
            }

            $scope.showSpinner();
            CommonService.GetListItems(lstMaterial).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.MaterialList = response.data.d.results;

                }
                else {
                    $scope.MaterialList = [];

                }
                $scope.gridOptions.data = $scope.MaterialList;
                $scope.hideSpinner();
            });
        };
        $scope.GetMaterialsList = function () {
            var lstBill = {
                title: "Materials",
                fields: ["*", "ItemCategory/ItemCategoryName", "Unit/UnitName"],
                lookupFields: ["ItemCategory", "Unit"],
                limitTo: 20,
                orderBy: "CreatedOn desc"
            };
            $scope.showSpinner();
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.MaterialList = response.data.d.results;
                    $scope.gridOptions.data = $scope.MaterialList;

                }
                else {
                    $scope.MaterialList = [];
                    $scope.gridOptions.data = [];

                }
                $scope.hideSpinner()
            });
        };
        $scope.GetUnitList = function (callback) {
            var lstBill = {
                title: "Units",
                fields: ["*"],
                filter:["Active eq 1"],
                orderBy: "UnitName"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.UnitList = response.data.d.results;

                    if (callback)
                        callback();
                }
            });
        };
        $scope.GetMaterialById = function () {
            var lstBill = {
                title: "Materials",
                fields: ["*"],
                filter: ["MaterialId eq " + $scope.ID],
                orderBy: "CreatedOn desc"
            };
            CommonService.GetListItems(lstBill).then(function (response) {
                if (response && response.data.d.results.length > 0) {
                    $scope.EditMaterial = response.data.d.results[0];
                    $scope.EditMaterial.ItemCategoryId = $filter('filter')($scope.ItemCatogoryList, { ItemCategoryId: $scope.EditMaterial.ItemCategoryId }, true)[0].ItemCategoryId;
                    $scope.EditMaterial.RetailRate = parseFloat($scope.EditMaterial.RetailRate);
                    $scope.EditMaterial.WholeSaleRate = parseFloat($scope.EditMaterial.WholeSaleRate);
                    $scope.EditMaterial.ReorderLevel = parseFloat($scope.EditMaterial.ReorderLevel);
                    //$scope.EditMaterial.CostingPrice = $scope.EditMaterial.CostingPrice;
                    //$scope.EditMaterial.QuantityInHand = parseFloat($scope.EditMaterial.QuantityInHand);
                    //$scope.EditMaterial.StdPkg = parseFloat($scope.EditMaterial.StdPkg);
                    //$scope.EditMaterial.BoxQty = parseFloat($scope.EditMaterial.BoxQty);
                    $scope.EditMaterial.RateUnitId = $scope.EditMaterial.RateUnitId === null ? 0 : parseFloat($scope.EditMaterial.RateUnitId);
                    $scope.EditMaterial.Active = $scope.EditMaterial.Active == 1 ? true : false;
                }
            });
        };

        $scope.RedirectDashboard = function () {
            $location.path('/Materials');
        };

        $scope.init = function () {

            GlobalVariableService.validateUrl($location.$$path);
            $scope.GetUnitList(function () {
                $scope.GetItemCategory(function () {
                    if ($scope.ID > 0) {
                        $scope.GetMaterialById();
                    }
                    //else {
                    //    $scope.GetMaterialsList();
                    //}
                });
            });
        };

        $scope.init();
    }]);