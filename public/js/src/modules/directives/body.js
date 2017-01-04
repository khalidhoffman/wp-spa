var _ = require('lodash'),
    url = require('url'),

    // local modules
    utils = require('utils'),
    configLoader = require('modules/services/config-loader'),
    ngApp = require('ng-app');

console.log("require('modules/directives/body')");

ngApp.directive('body', function () {
    return {
        restrict: 'E',
        controller: [
            '$scope', '$element', '$location', '$timeout', 'contentLoader', 'configLoader',
            function ($scope, $element, $location, $timeout, contentLoader, configLoader) {
                var $window = angular.element(window),
                    config = configLoader.getDefaults();
                $scope.mainSelector = configLoader.getMainSelector();
                $scope.$loadingView = $(require("raw!./html/loading-view.html"));
                $scope.loadingClassName = 'wp-spa-loading-view--loading';

                $scope.flags = {};

                function interceptAction(evt) {
                    console.log('ngBody.interceptAction()');
                    var targetHref = evt.currentTarget.href || location.href,
                        targetHrefMeta = url.parse(targetHref),
                        targetPath = targetHref.replace(/#.*/i, '');

                    console.log('ngBody.interceptAction() - intercepting route to %s (%s)', targetHref, targetPath);
                    if (targetHrefMeta.hash) {
                        // same page. only a hash change. so ignore
                        console.log('ngBody.interceptAction() - no-op')
                    } else if (/wp-admin\/?/.test(targetHrefMeta.path)) {
                        // ignore wp-admin
                        console.log('ngBody.interceptAction() - no-op')
                    } else if (contentLoader.wordpress.hasPageSync(targetHref) || contentLoader.wordpress.hasPostSync(targetHref)) {
                        console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
                        evt.preventDefault();
                        $scope.$apply(function () {
                            $location.path(utils.getPathFromUrl(targetHref));
                        });
                    }
                }

                $scope.updateFlags = function () {
                    $scope.flags.asyncAnimation = parseInt(config.asyncAnimation) == 1;
                    $scope.flags.showLoadingScreen = parseInt(config.showLoadingScreen) == 1;
                };

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

                $scope.setupCurrentView = function () {
                    $scope.sanitize();
                };

                $scope.showLoading = function () {
                    if ($scope.flags.showLoadingScreen) {
                        $scope.$loadingView.addClass($scope.loadingClassName);
                    }
                };

                $scope.hideLoading = function () {
                    if ($scope.flags.showLoadingScreen) {
                        $scope.$loadingView.removeClass($scope.loadingClassName);
                    }
                };

                $scope.addView = function ($view, $root, callback) {
                    $view.one('animationend', function () {
                        $timeout(function () {
                            $view.removeClass('animate-page-in');
                            $view.css({'animation-name': ''});
                            $view.css({'animation-duration': ''});
                            if (callback) callback();

                            // init some events in case 3rd-party lib uses it for rendering
                            $window.resize();
                            $window.scroll();
                            $scope.setupCurrentView();
                        });
                    });

                    utils.jumpTo(0); // jump to top of screen
                    $view.addClass('animate-page-in');
                    $root.prepend($view);
                };

                $scope.removeView = function ($view, callback) {
                    $view.one('animationend', function () {
                        $timeout(function () {
                            if (callback) callback();
                            $view.remove();
                        })
                    });

                    $view.addClass('animate-page-out');
                };

                $scope.addLoadingView = function(){
                    if ($scope.flags.showLoadingScreen) {
                        $element.append($scope.$loadingView);
                    }
                };

                function init() {

                    configLoader.fetchConfig(function (err, configData) {
                        config = configData || config;

                        $scope.updateFlags();
                        $scope.setupCurrentView();
                        $scope.addLoadingView();

                        $scope.$on('head:update', function (event, data) {
                            $scope.destroyClickOverrides();
                            var $DOM = data.$DOM,
                                $body = $DOM.find('body'),
                                $root = data.$root,
                                $newContent = $body.find($scope.mainSelector),
                                $activeContent = $element.find($scope.mainSelector);

                            console.log('body.view:update - new $spaContent: %o', $newContent);

                            function setAttrs() {
                                // update DOM.body
                                _.forEach($body[0].attributes, function (attr) {
                                    $element.attr(attr.name, attr.value);
                                });

                                if (config.animationInName) $newContent.css({'animation-name': config.animationInName});
                                if (config.animationOutName) $activeContent.css({'animation-name': config.animationOutName});
                                if (config.animationInDuration) $newContent.css({'animation-duration': config.animationInDuration + 'ms'});
                                if (config.animationOutDuration) $activeContent.css({'animation-duration': config.animationOutDuration + 'ms'});
                            }

                            $scope.showLoading();
                            setAttrs();
                            if ($scope.flags.asyncAnimation) {
                                $scope.addView($newContent, $root, function () {
                                    $scope.hideLoading();
                                });
                                $scope.removeView($activeContent);
                            } else {
                                $scope.removeView($activeContent, function () {
                                    $scope.addView($newContent, $root, function () {
                                        $scope.hideLoading();
                                    });
                                });

                            }

                        });
                    });
                }

                init();

            }]
    };
});

module.exports = ngApp;

