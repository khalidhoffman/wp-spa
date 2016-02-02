define([
    'require',
    'modules/services/html-provider',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');

    console.log("require('main-controller')");

    ngApp.controller('MainController', ['$scope', "spaContentProvider", function ($scope, spaContentProvider) {
        console.log('mainController(%O)', arguments);
        window['SPA'] = window['SPA'] || {
            context : null
        };

        angular.element('body').on('view:update', function(){
            var _SPA = window['SPA'];
            if(typeof _SPA.ready === 'function') _SPA.ready.apply(_SPA.context);
            angular.element(window).trigger('view:update');
        });
    }]);

    return ngApp;
});
