define([
    'require',
    'modules/services/content-service',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');

    console.log("require('main-controller')");

    ngApp.controller('mainController', ['$scope', "contentService", "$rootScope", function ($scope, contentService, $rootScope) {
        console.log('mainController(%O)', arguments);

        $scope.$on('$routeChangeSuccess', function (event, to, from) {
            var route = (to && to.pathParams && to.pathParams.route) ? to.pathParams.route : './';
            console.log('mainController.$routeChangeSuccess() - routing to %o', route);
            contentService.getHTML(route, {
                done : function(err, $DOM){
                    if(err){
                        console.warn(err);
                    } else {
                        console.log('mainController.$routeChangeSuccess() - update');
                        $rootScope.$broadcast("view:update", $DOM, route)
                    }
                }
            });
        });
    }]);

    return ngApp;
});
