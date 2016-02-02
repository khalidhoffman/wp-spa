define([
    'require',
    'utils',
    "controllers",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app'),
        utils = require('utils');

    console.log("require('router')");
    return ngApp.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
        console.log("ngApp.config(() - initializing router");

        $locationProvider.html5Mode(true).hashPrefix('!');

        var $ngView = angular.element('div[ng-view]');
            defaultRouterParams = {
            template : function(){
                return "<ng-content>"+$ngView.html()+"</ng-content>"
            },
            controller : 'MainController'
        };

        $routeProvider
            .when('/:route*', defaultRouterParams)
            .otherwise(defaultRouterParams);

        return $routeProvider;
    }]);
});