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
    var $ = require('jquery');
    if($('[ng-view]').length == 0){
        // ng-view must be included for wp-spa to work
        $('header + *').wrap('<div ng-view ng-cloak></div>')
    }
    //$(document).find('header').after('<ng-content ng-view>');
    //$(document).find('footer').before('</ng-content>');
    return require('angular').module('dp-spa', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngAria']);
});