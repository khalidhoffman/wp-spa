var _ = require('lodash'),
    $ = require('jquery'),
    url = require('url'),
    utils = require('utils'),
    configLoader = require('modules/services/config-loader'),
    DiffDOM = require('diff-dom'),
    diffDOM = new DiffDOM(),
    ngApp = require('ng-app');


console.log("require('modules/directives/body')");

ngApp.directive('body', function () {
    return {
        restrict: 'AE',
        controller: [
            '$scope', '$element', '$location', 'contentLoader', 'configLoader',
            function ($scope, $element, $location, contentLoader, configLoader) {
                var $window = angular.element(window),
                    config = configLoader.getDefaults()
                $scope.mainSelector = configLoader.getMainSelector();

                configLoader.fetchConfig(function (err, configData) {
                    config = configData || config;
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
                    $scope.clickables = $element.find('[href]').not('[data-spa-initialized]');
                    $scope.clickables.on('click', interceptAction);
                    $scope.clickables.prop('data-spa-initialized', true);
                };

                $scope.sanitize = function () {
                    $scope.createClickOverrides();
                    $scope.clickables.each(function (index, el) {
                        this.setAttribute('ng-href', this.href);
                    });
                };

                $scope.setupNewView = function () {
                    $scope.sanitize();
                };

                $scope.cache = {};

                function init() {
                    configLoader.fetchConfig(function (configData) {
                        $scope.setupNewView();

                        $scope.$on('head:update', function (event, data) {
                            $scope.destroyClickOverrides();
                            var $DOM = data.$DOM,
                                route = data.path,
                                $body = $DOM.find('body'),
                                $root = data.$root,
                                $newContent = $body.find($scope.mainSelector),
                                $activeContent = $element.find($scope.mainSelector);

                            console.log('body.view:update - new $spaContent: %o', $newContent);

                            // update DOM.body
                            _.forEach($body[0].attributes, function (attr, index) {
                                $element.attr(attr.name, attr.value);
                            });

                            function showNewView() {
                                utils.jumpTo(0);

                                $newContent.addClass('animate-page-in');
                                $root.prepend($newContent);
                                $newContent.one('animationend', function () {
                                    $scope.$apply(function () {
                                        $newContent.removeClass('animate-page-in');
                                        $newContent.css({'animation-name': ''});
                                        $newContent.css({'animation-duration': ''});
                                        $activeContent.detach();
                                        $activeContent.removeClass('animate-page-out');

                                        // init some events in case 3rd-party lib uses it for rendering
                                        $window.resize();
                                        $window.scroll();
                                    });
                                });
                            }

                            $activeContent.one('animationend', function () {
                                $scope.$apply(function () {
                                    $scope.cache[route] = $activeContent;

                                    // TODO should probably use check of reference to state
                                    // of $newContent view (whether already prepended or not)
                                    if (parseInt(config.asyncAnimation) == 0) showNewView();

                                    $scope.setupNewView();
                                })
                            });

                            if (config.animationInName) $newContent.css({'animation-name': config.animationInName});

                            if (config.animationOutName) $activeContent.css({'animation-name': config.animationOutName});

                            if (config.animationInDuration) $newContent.css({'animation-duration': config.animationInDuration + 'ms'});
                            if (config.animationOutDuration) $activeContent.css({'animation-duration': config.animationOutDuration + 'ms'});

                            $activeContent.addClass('animate-page-out');
                            if (parseInt(config.asyncAnimation) == 1) showNewView();

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

