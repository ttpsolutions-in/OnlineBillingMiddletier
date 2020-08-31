(function () {

    'use strict';
    app.controller('nextController', ['$scope', 'GlobalVariableService', function ($scope, GlobalVariableService) {
        GlobalVariableService.validateRequest();
    }]);
})();