var _ = require('lodash'),
    $ = require('jquery'),
    url = require('url'),
    utils = require('utils'),
    configLoader = require('modules/services/config-loader'),
    DiffDOM = require('diff-dom'),
    diffDOM = new DiffDOM(),
    ngApp = require('ng-app'),

    config = {};

console.log("require('modules/directives/body')");


ngApp.directive('body', function () {
    return {
        restrict: 'AE',
        controller: [
            '$scope', '$element', '$location', 'contentLoader', 'configLoader',
            function ($scope, $element, $location, contentLoader, configLoader) {
                $scope.mainSelector = configLoader.getMainSelector();

                configLoader.getConfig(function (err, configData) {
                    config = configData;
                });

                function interceptAction(evt) {
                    console.log('ngBody.interceptAction()');
                    var targetHref = evt.currentTarget.href,
                        targetHrefMeta = url.parse(targetHref),
                        targetPath = targetHref.replace(/#.*/i, '');

                    console.log('ngBody.interceptAction() - intercepting route to %s (%s)', targetHref, targetPath);
                    if (targetHrefMeta.hash) {
                        // same page. only a hash change. so ignore
                        console.log('ngBody.interceptAction() - no-op')
                    } else if (contentLoader.wordpress.hasPageSync(targetHref) || contentLoader.wordpress.hasPostSync(targetHref)) {
                        console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
                        evt.preventDefault();
                        $scope.$apply(function () {
                            $location.path(utils.getPathFromUrl(targetHref));
                        });
                    }
                }

                $scope.destroyClickOverrides = function () {
                    if ($scope.clickables) $scope.clickables.off('click', null, interceptAction);
                    delete $scope.clickables;
                };

                $scope.createClickOverrides = function () {
                    $scope.clickables = $element.find('[href]');
                    $scope.clickables.on('click', interceptAction);
                };

                $scope.sanitize = function () {
                    $scope.clickables.each(function (index, el) {
                        this.setAttribute('ng-href', this.href);
                    });
                };


                $scope.setup = function () {
                    $scope.createClickOverrides();
                    $scope.sanitize();
                };

                $scope.cache = {};

                function init() {
                    configLoader.getConfig(function (configData) {
                        $scope.setup();

                        $scope.$on('head:update', function (event, data) {
                            $scope.destroyClickOverrides();
                            var $DOM = data.$DOM,
                                route = data.path,
                                $body = $DOM.find('body'),
                                $root = data.$root,
                                $newContent = $body.find($scope.mainSelector),
                                $newScripts = data.old.$scripts,
                                $activeContent = $element.find($scope.mainSelector);
                            // $loadedElements = $body.find("[data-spa-loaded='true']");
                            console.log('body.view:update - new $spaContent: %o', $newContent);


                            // update DOM.body
                            _.forEach($body[0].attributes, function (attr, index) {
                                $element.attr(attr.name, attr.value);
                            });

                            // $newScripts.appendTo($newContent);
                            // $loadedElements.remove();

                            function showNew() {
                                utils.jumpTo(0);
                                $root.prepend($newContent);
                                $newContent.one('animationend', function () {
                                    $newContent.removeClass('animate-page-in');
                                    $newContent.css({'animation-name': ''});
                                    $newContent.css({'animation-duration': ''});
                                });
                            }

                            $activeContent.one('animationend', function () {
                                $scope.cache[route] = $activeContent;
                                $activeContent.detach();
                                $activeContent.removeClass('animate-page-out');

                                if (!config.asyncAnimation) showNew();

                                $scope.setup();
                            });
                            $activeContent.addClass('animate-page-out');


                            if (config.animationName) $newContent.css({'animation-name': config.animationName});
                            if (config.animationDuration) $newContent.css({'animation-duration': config.animationDuration});
                            $newContent.addClass('animate-page-in');
                            if (config.asyncAnimation) showNew();


                        });
                    });
                }


                init();

            }],
        link: function (scope, element, attrs, controller, transcludeFn) {
            console.log('body.link(%O)', arguments);
        }
    };
});

module.exports = ngApp;

