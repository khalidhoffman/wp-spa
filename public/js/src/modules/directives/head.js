var DiffDOM = require('diff-dom'),
    diffDOM = new DiffDOM(),
    skateDomDiff = require('skatejs-dom-diff'),
    _ = require('lodash'),
    $ = require('jquery'),
    AST = require('modules/services/ast-builder.js'),
    ngApp = require('ng-app');

ngApp.directive('head', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs, controller, transcludeFn) {
            console.log('head.link(%O)', arguments);
        },
        controller: ['$scope', '$element', function ($scope, $element) {
            console.log('head.controller(%O)', arguments);


            function init() {

                $scope.$on('html:update', function (event, data) {
                    var $DOM = data.$DOM;
                    console.log("head.link()$scope.$on('view:update')");
                    var $head = $DOM.find('head'),
                        $newStyles = data.new.$styles,
                        $oldScripts = data.old.$scripts;

                    $oldScripts.remove();

                    // add new styles to incoming head
                    $head.append($newStyles);

                    // update meta
                    $element.find('meta').remove();
                    $element.prepend($head.find('meta'));
                    $element.find('title').remove();
                    $element.prepend($head.find('title'));

                    $scope.$broadcast('head:update', data)
                });

            }

            init();
        }]
    };
});

module.exports = ngApp;
