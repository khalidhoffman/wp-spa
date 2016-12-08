var utils = require('utils'),
    $ = require('jquery'),

    contentLoader = require('../services/content-loader'),
    ScriptRegister = require('../models/dom-node-register'),

    $window = $(window),
    ngApp = require('ng-app');

window.WPSPA = $window;
console.log("require('main-controller')");

ngApp.controller('mainController', [
    '$scope', "contentLoader", "$rootScope",
    function ($scope, contentLoader, $rootScope) {
        console.log('mainController(%O)', arguments);
        $scope.$window = $window;
        $scope.scriptRegister = new ScriptRegister();

        $scope.$on('$locationChangeSuccess', function (event, to, from) {
            if (to == from) return;
            console.log('route: %o', arguments);
            //var route = (to && to.pathParams && to.pathParams.route) ? to.pathParams.route : './';
            var route = utils.getPathFromUrl(to);
            console.log('mainController.$locationChangeSuccess() - routing to %o', route);
            contentLoader.getHTML(to, {
                done: function (err, $DOM) {
                    if (err) {
                        console.warn(err);
                    } else {
                        var data = {
                            path: route,
                            url: to,
                            $DOM: $DOM
                        };
                        console.log('mainController.$locationChangeSuccess() - update');
                        $rootScope.$broadcast("view:update", data);
                        $scope.$window.trigger('view:update', data);
                    }
                }
            });
        });
    }]);

module.exports = ngApp;
