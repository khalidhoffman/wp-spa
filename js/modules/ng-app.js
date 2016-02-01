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
    //var $ = require('jquery');
    //$(document).find('header').after('<ng-content ng-view>');
    //$(document).find('footer').before('</ng-content>');
    return require('angular').module('dp-spa', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngAria']);
});