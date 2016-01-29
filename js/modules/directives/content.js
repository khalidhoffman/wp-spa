define(['require', 'ngApp'], function (require) {
    var ngApp = require('ngApp');
    ngApp.directive('ng-content', function () {
        return {
            restrict: 'AE',
            controller : function($scope, $ngRoute){
                console.log('ng-content.controller() - : %O', arguments);

                $scope.$on('$routeChangeSuccess', function () {
                    console.log('ng-content.controller() - navigate');
                });

            }
        };
    });

});