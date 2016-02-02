define([
    'require',
    'modules/services/html-loader',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');

    console.log("require('main-controller')");

    ngApp.controller('MainController', ['$scope', "spaContentProvider", function ($scope, spaContentProvider) {
        console.log('mainController(%O)', arguments);

    }]);

    return ngApp;
});