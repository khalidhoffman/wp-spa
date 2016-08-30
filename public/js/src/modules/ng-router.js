define([
    'require',
    'utils',
    "controllers",
    "modules/services/template-provider",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app'),
        utils = require('utils');

    console.log("require('router')");
    return ngApp.config(["$routeProvider", "$locationProvider", '_$templateProvider', function ($routeProvider, $locationProvider, _$templateProvider) {
        console.log("ngApp.config(() - initializing router");

        $locationProvider.html5Mode(true).hashPrefix('!');

        var defaultRouterParams = {
            template : function(){
                return "<ng-content>"+_$templateProvider.getDefaultContent()+"</ng-content>"
            },
            controller : 'mainController'
        };

        $routeProvider
            .when('/:route*', defaultRouterParams)
            .otherwise(defaultRouterParams);

        return $routeProvider;
    }]);
});