define([
    'require',
    'angular',
    'jquery',
    'angular-aria',
    'angular-sanitize',
    'angular-animate'
], function (require) {
    var angular = require('angular');
    return angular.module('dp-spa', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngAria']);

});