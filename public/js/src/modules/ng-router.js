var angular = require('angular'),
    ngApp   = require('ng-app'),
    utils   = require('utils');

console.log("require('router')");
module.exports = ngApp.config(["$routeProvider", "$locationProvider",
  function ($routeProvider, $locationProvider) {
    console.log('using base value: ', angular.element('head base').attr('href'));
    console.log("ngApp.config(() - initializing router");

    $locationProvider.html5Mode(true).hashPrefix('!');
  }]);
