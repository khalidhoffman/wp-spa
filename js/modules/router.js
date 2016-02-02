define([
    'require',
    'utils',
    'wordpress',
    "controllers",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app'),
        utils = require('utils'),
        wordpress = require('wordpress');

    console.log("require('router')");
    return ngApp.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
        console.log("ngApp.config(() - initializing router");

        $locationProvider.html5Mode(true).hashPrefix('!');

        var defaultRouterParams = {
            template : function(){
                return "<ng-content></ng-content>"
            },
            controller : 'MainController'
        };

        $routeProvider
            .when('/:route*', defaultRouterParams)
            .otherwise(defaultRouterParams);

        return $routeProvider;
    }]);
});