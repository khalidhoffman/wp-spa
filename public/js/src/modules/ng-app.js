define([
    'require',
    'jquery',
    'angular',
    'angular-aria',
    'angular-sanitize',
    'angular-route',
    'angular-animate'
], function (require) {
    console.log("require('ng-app')");
    return require('angular').module('dp-spa', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngAria']);
});