ETradersApp.controller("MaterialsController", ['GlobalVariableService', '$scope', '$filter', '$http', '$location', '$routeParams', 'toaster', 'CommonService', 'uiGridConstants',
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
    $scope.MaterialList = [];
    $scope.EditMaterial = {};
    $scope.submitted = false;
    //$scope.ItemCatogoryList = [];
    $scope.Material = {
          Product: null
        , Model: null
        , Size1: null
        , Size2: null
        , StdPkg: null
        , BoxQty: null
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
            { width:250, displayName: 'Display Name', field: 'DisplayName', cellTooltip: true, enableCellEdit: false, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width:250, displayName: 'Category', field: 'ItemCategory.ItemCategoryName', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width:250, displayName: 'Description', field: 'Descriptioin', enableCellEdit: false, enableCellEditOnFocus: true, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 80, displayName: 'Model', field: 'Model', enableCellEdit: false, cellTooltip: true, cellClass: 'text-left', headerCellClass: 'text-center' },
            { width: 80, displayName: 'Size 1', field: 'Size1', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { width: 80, displayName: 'Size 2', field: 'Size2', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ width: 80, displayName: 'Std Pkg', field: 'StdPkg', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ width: 80, displayName: 'Box Qty', field: 'BoxQty', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ width: 100, displayName: 'Retail Rate', field: 'RetailRate', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ width: 100, displayName: 'Whole Sale Rate', field: 'WholeSaleRate', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ width: 100, displayName: 'Costing Price', field: 'CostingPrice', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ width: 80, displayName: 'QIH', field: 'QuantityInHand', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            //{ width: 100, displayName: 'Reorder Level', field: 'ReorderLevel', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
            { width: 100, displayName: 'QIH', field: 'QIH', enableCellEdit: false, cellTooltip: true, cellClass: 'text-right', headerCellClass: 'text-center' },
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
            var strItemCategoryName = $scope.Material.ItemCategory.ItemCategoryName;
            var strItemDescription = $scope.Material.Description;

            if (isValid) {
                var values = {
                    "Descriptioin": $scope.Material.Description
                    //, "Unit": $scope.Material.Unit
                    //, "NoOfPiecePerUnit": $scope.Material.NoOfPiecePerUnit.toString()
                    , "RetailRate": $scope.Material.RetailRate.toString()
                    , "WholeSaleRate": $scope.Material.WholeSaleRate.toString()
                    , "CostingPrice": $scope.Material.CostingPrice.toString()
                    //, "QuantityInHand": $scope.Material.QuantityInHand.toString()
                    , "ReorderLevel": $scope.Material.ReorderLevel.toString()
                    , "CreatedOn":new Date()
                    , "Product": $scope.Material.Product
                    , "Model": $scope.Material.Model
                    , "Size1": $scope.Material.Size1
                    , "Size2": $scope.Material.Size2
                    , "StdPkg": $scope.Material.StdPkg == null ? null :$scope.Material.StdPkg.toString()
                    , "BoxQty": $scope.Material.BoxQty == null ? null :$scope.Material.BoxQty.toString()
                    , "ItemCategoryId": $scope.Material.ItemCategory.ItemCategoryId
                    , "DisplayName": strItemCategoryName.substring(0, strItemCategoryName.indexOf(' ')) + '-' + strItemDescription.substring(0, strItemDescription.indexOf(' ')) + ' ' + $scope.Material.Model + ' ' + $scope.Material.Size1 + ' ' + $scope.Material.Size2
                };
                CommonService.PostData("Materials", values).then(function (response) {
                    console.log("response " + response);
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
            var strItemCategoryName = $scope.EditMaterial.ItemCategory.ItemCategoryName;
            var strItemDescription = $scope.EditMaterial.Descriptioin;

            if (isValid) {
                var values = {
                    "Descriptioin": $scope.EditMaterial.Descriptioin
                    , "RetailRate": $scope.EditMaterial.RetailRate.toString()
                    , "WholeSaleRate": $scope.EditMaterial.WholeSaleRate.toString()
                    , "CostingPrice": $scope.EditMaterial.CostingPrice.toString()
                    //, "QuantityInHand": $scope.EditMaterial.QuantityInHand.toString()
                    , "ReorderLevel": $scope.EditMaterial.ReorderLevel.toString()
                    , "UpdatedOn": new Date()
                    , "Product": $scope.EditMaterial.Product==null?'':$scope.EditMaterial.Product.toString()
                    , "Model": $scope.EditMaterial.Model == null ? '' : $scope.EditMaterial.Model.toString()
                    , "Size1": $scope.EditMaterial.Size1 == null ? '' : $scope.EditMaterial.Size1.toString()
                    , "Size2": $scope.EditMaterial.Size2 == null ? '' : $scope.EditMaterial.Size2.toString()
                    , "StdPkg": isNaN($scope.EditMaterial.StdPkg)? "0" : $scope.EditMaterial.StdPkg.toString()
                    , "BoxQty": isNaN($scope.EditMaterial.BoxQty) ? "0" : $scope.EditMaterial.BoxQty.toString()
                    , "ItemCategoryId": $scope.EditMaterial.ItemCategory.ItemCategoryId
                    , "DisplayName": strItemCategoryName.substring(0, strItemCategoryName.indexOf(' ')) + '-' + strItemDescription.substring(0, strItemDescription.indexOf(' ')) + ' ' + $scope.EditMaterial.Model + ' ' + $scope.EditMaterial.Size1 + ' ' + $scope.EditMaterial.Size2
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
            fields: ["*", "ItemCategory/ItemCategoryName"],
            lookupFields: ["ItemCategory"],
            filter:["1 eq 1"],
            limitTo: 20,
            orderBy: "CreatedOn desc"
        };
        if ($scope.searchDisplayName !=='') {
            lstMaterial.filter = lstMaterial.filter + " and indexof(DisplayName,'" + $scope.searchDisplayName + "') gt -1";
        }
        if ($scope.searchDescription !== '') {
            lstMaterial.filter = lstMaterial.filter + " and indexof(Descriptioin,'" + $scope.searchDescription + "') gt -1";
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
            fields: ["*","ItemCategory/ItemCategoryName"],
            lookupFields: ["ItemCategory"],
            limitTo:20,
            orderBy: "CreatedOn desc"
        };
        $scope.showSpinner();
        CommonService.GetListItems(lstBill).then(function (response) {
            if (response && response.data.d.results.length > 0) {
                $scope.MaterialList = response.data.d.results;
                $scope.gridOptions.data = $scope.MaterialList;
                $scope.hideSpinner()
                
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
                $scope.EditMaterial.ItemCategory = $filter('filter')($scope.ItemCatogoryList, { ItemCategoryId: $scope.EditMaterial.ItemCategoryId }, true)[0];
                $scope.EditMaterial.RetailRate = parseFloat($scope.EditMaterial.RetailRate);
                $scope.EditMaterial.WholeSaleRate = parseFloat($scope.EditMaterial.WholeSaleRate);
                $scope.EditMaterial.ReorderLevel = parseFloat($scope.EditMaterial.ReorderLevel);
                //$scope.EditMaterial.CostingPrice = $scope.EditMaterial.CostingPrice;
                //$scope.EditMaterial.QuantityInHand = parseFloat($scope.EditMaterial.QuantityInHand);
                $scope.EditMaterial.StdPkg = parseFloat($scope.EditMaterial.StdPkg);
                $scope.EditMaterial.BoxQty = parseFloat($scope.EditMaterial.BoxQty);
            }
        });
    };

    $scope.RedirectDashboard = function () {
        $location.path('/Materials');
    };

    $scope.init = function () {

        GlobalVariableService.validateUrl($location.$$path);

        $scope.GetItemCategory(function () {
            if ($scope.ID > 0) {
                $scope.GetMaterialById();
            }
            else {
                $scope.GetMaterialsList();
            }
        });
        
    };

    $scope.init();
}]);