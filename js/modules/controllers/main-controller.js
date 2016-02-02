define([
    'require',
    'modules/services/html-provider',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');

    console.log("require('main-controller')");

    ngApp.controller('MainController', ['$scope', "spaContentProvider", function ($scope, spaContentProvider) {
        console.log('mainController(%O)', arguments);

    }]);

    return ngApp;
});