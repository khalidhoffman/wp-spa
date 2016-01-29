define(['require', 'ngApp'], function (require) {
    var ngApp = require('ngApp');
    ngApp.directive('footer', function () {
        return {
            restrict: 'AE',
            controller : function($scope, $ngRoute){
                console.log('footer.controller() - : %O', arguments);

                $scope.$on('$routeChangeSuccess', function () {
                    console.log('footer.controller() - navigate');
                });

            }
        };
    });

});