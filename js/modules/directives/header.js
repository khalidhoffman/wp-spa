define(['require', 'ngApp'], function (require) {
    var ngApp = require('ngApp');
    ngApp.directive('header', function () {
        return {
            restrict: 'AE',
            controller : function($scope, $ngRoute){
                console.log('header.controller() - : %O', arguments);

                $scope.$on('$routeChangeSuccess', function () {
                    console.log('header.controller() - navigate');
                });

            }
        };
    });

});