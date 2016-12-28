define([
  'require',
  'utils',
  "controllers",
  "modules/services/template-provider",
  'ng-app'
], function (require) {
  var ngApp = require('ng-app'),
    utils = require('utils'),
    angular = require('angular');

  console.log("require('router')");
  return ngApp.config(["$routeProvider", "$locationProvider", '_$templateProvider', function ($routeProvider, $locationProvider, _$templateProvider) {
    console.log('using base value: ', angular.element('head base').attr('href'));
    console.log("ngApp.config(() - initializing router");

    $locationProvider.html5Mode(true).hashPrefix('!');

    var defaultRouterParams = {
      template: function () {
        return _$templateProvider.getDefaultContent()
      },
      controller: 'mainController'
    };

    /*
     $routeProvider
     .when('/:route*', defaultRouterParams)
     .otherwise(defaultRouterParams);

     return $routeProvider;
     */
    return {};
  }]);
});
