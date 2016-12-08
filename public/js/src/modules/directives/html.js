var _ = require('lodash'),
    $ = require('jquery'),
    ngApp = require('ng-app'),

    DOMNodeRegister = require('../models/dom-node-register'),
    ScriptRegisterEntry = require('../models/script-register-entry'),
    StyleRegisterEntry = require('../models/style-register-entry');

ngApp.directive('html', function () {
    return {
        restrict: 'AE',
        controller: ['$scope', '$element', function ($scope, $element) {

            $scope.selectors = {
                script: 'script',
                style: "link[rel='stylesheet'], style"
            };

            $scope.scriptRegister = new DOMNodeRegister();
            $scope.styleRegister = new DOMNodeRegister();

            $scope.registerActiveScripts = function () {
                var $activeScripts = $element.find('script');
                $activeScripts.each(function (index, el) {
                    $scope.scriptRegister.add(new ScriptRegisterEntry(el));
                    console.warn('ng.html - adding %o', el)
                })
            };

            $scope.registerActiveStyles = function () {
                var $activeStyles = $element.find($scope.selectors.style);
                $activeStyles.each(function (index, el) {
                    $scope.styleRegister.add(new StyleRegisterEntry(el));
                    console.warn('ng.html - adding %o', el)
                })
            };

            function init() {

                $scope.registerActiveScripts();
                $scope.registerActiveStyles();


                $scope.$on('view:update', function (event, data) {
                    var $DOM = data.$DOM,
                        $styles = $DOM.find($scope.selectors.style),
                        $scripts = $DOM.find($scope.selectors.script);

                    $scripts.each(function (index, el) {
                        var scriptRegEntry = new ScriptRegisterEntry(el);
                        if ($scope.scriptRegister.contains(scriptRegEntry)) {
                            scriptRegEntry.$el.attr('data-spa-loaded', true);
                            console.log('ng.html - excluding %o', el)
                        } else {
                            console.warn('ng.html - adding %o', el)
                        }
                    });

                    $styles.each(function (index, el) {
                        var styleRegEntry = new StyleRegisterEntry(el);
                        if ($scope.styleRegister.contains(styleRegEntry)) {
                            styleRegEntry.$el.attr('data-spa-loaded', true);
                            console.log('ng.html - excluding %o', el)
                        } else {
                            //
                            console.warn('ng.html - adding %o', el)
                        }
                    });


                    var eventData = _.defaults({
                        $scripts: $scripts,
                        $styles: $styles,
                        old: {
                            $scripts: $scripts.not("[data-spa-loaded='true']"),
                            $styles: $styles.not("[data-spa-loaded='true']")
                        },
                        new: {
                            $scripts: $scripts.filter("[data-spa-loaded='true']"),
                            $styles: $styles.filter("[data-spa-loaded='true']")
                        }
                    }, data);
                    $scope.$broadcast('html:update', eventData)
                });

            }

            init();
        }]
    };
});

module.exports = ngApp;
