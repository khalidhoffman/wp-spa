define([
    'require',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');

    console.log("require('main-controller')");

    ngApp.controller('MainController', ['$scope', function ($scope) {
        console.log('mainController()');

        $scope.$on('$locationChangeStart', function(event) {
            console.log("mainController() - $scope.$on('$locationChangeStart') called w/ %O", arguments);
            //event.preventDefault();
        });
    }]);

    return ngApp;
});