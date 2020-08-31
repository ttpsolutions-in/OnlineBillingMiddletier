'use strict';
ETradersApp.factory('authData', [ function () {
    var authDataFactory = {};

    var _authentication = {
        IsAuthenticated: false,
        userName: ""
    };
    authDataFactory.authenticationData = _authentication;

    return authDataFactory;
}]);

ETradersApp.service('AuthenticationData', function () {
    this.create = function (userName, isAuthenticated, accessToken, expiry) {
        this.IsAuthenticated = isAuthenticated;
        this.UserName = userName;
        this.AccessToken = accessToken;
        this.ExpiryDate = expiry;
    }
    this.Destroy = function (userName, isAuthenticated, accessToken, expiry) {
        this.IsAuthenticated = false;
        this.UserName = null;
        this.AccessToken = null;
        this.ExpiryDate = null;
    }
});