define([
    'require',
    'modules/services/content-service',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');

    console.log("require('main-controller')");

    ngApp.controller('mainController', ['$scope', "contentService", function ($scope, contentService) {
        console.log('mainController(%O)', arguments);

        $scope.$on('$routeChangeStart', function (event, to, from) {
            var route = (to && to.pathParams && to.pathParams.route) ? to.pathParams.route : './';
            contentService.getHTML(route, {
                done : function(err, $DOM){
                    if(err){
                        console.warn(err);
                    } else {
                        $scope.$broadcast("view:update", $DOM)
                    }
                }
            });
        });
    }]);

    return ngApp;
});
