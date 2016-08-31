define([
    'require',
    'utils',
    'modules/services/content-service',
    'ng-app'
], function (require) {
    var utils = require('utils'),
        ngApp = require('ng-app');

    console.log("require('main-controller')");

    ngApp.controller('mainController', ['$scope', "contentService", "$rootScope", 
        function ($scope, contentService, $rootScope) {
            console.log('mainController(%O)', arguments);

            $scope.$on('$locationChangeSuccess', function (event, to, from) {
                console.log('route: %o', arguments);
                //var route = (to && to.pathParams && to.pathParams.route) ? to.pathParams.route : './';
                var route = utils.getPathFromUrl(to);
                console.log('mainController.$locationChangeSuccess() - routing to %o', route);
                contentService.getHTML(to, {
                    done : function(err, $DOM){
                        if(err){
                            console.warn(err);
                        } else {
                            console.log('mainController.$locationChangeSuccess() - update');
                            $rootScope.$broadcast("view:update", $DOM, route)
                        }
                    }
                });
            });
        }]);

    return ngApp;
});
