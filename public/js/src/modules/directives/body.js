var _ = require('lodash'),
    url = require('url'),

    $ = require('jquery'),

    // local modules
    utils = require('utils'),
    Module = require('../lib/module');

console.log("require('modules/directives/body')");

/**
 * @extends Module
 * @class BodyDirective
 * @constructor
 */
function BodyDirective() {
    Module.apply(this, arguments);

    var self = this,
        $scope = this;
    this.config = this.configLoader.getDefaults();
    this.$element = $('body');
    this.baseHrefRegex = new RegExp(url.parse(this.meta.baseHREF));

    $scope.mainSelector = this.configLoader.getMainSelector();
    $scope.$loadingView = $(require("raw!./html/loading-view.html"));
    $scope.loadingClassName = 'wp-spa-loading-view--loading';

    $scope.flags = {};

    this.$interceptAction = this.interceptAction.bind(this);

    this.configLoader.fetchConfig(function (err, configData) {
        self.config = configData || self.config;

        $scope.updateFlags();
        $scope.setupCurrentView();
        $scope.addLoadingView();

        $scope.$on('head:update', function (event, data) {
            $scope.destroyClickOverrides();
            var $DOM = data.$DOM,
                $body = $DOM.find('body'),
                $root = data.$root,
                $newContent = $body.find($scope.mainSelector),
                $activeContent = self.$element.find($scope.mainSelector);

            console.log('body.view:update - new $spaContent: %o', $newContent);

            function setAttrs() {
                // update DOM.body
                _.forEach($body[0].attributes, function (attr) {
                    self.$element.attr(attr.name, attr.value);
                });

                if (self.config.animationInName) $newContent.css({'animation-name': self.config.animationInName});
                if (self.config.animationOutName) $activeContent.css({'animation-name': self.config.animationOutName});
                if (self.config.animationInDuration) $newContent.css({'animation-duration': self.config.animationInDuration + 'ms'});
                if (self.config.animationOutDuration) $activeContent.css({'animation-duration': self.config.animationOutDuration + 'ms'});
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

BodyDirective.prototype = {

    interceptAction: function (evt) {
        console.log('ngBody.interceptAction()');
        var self = this,
            targetHref = evt.currentTarget.href || location.href,
            route = this.getRouteFromHREF(targetHref);

        if (route) {
            console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
            evt.preventDefault();
            self.router.path(route);
        } else {
            console.log('ngBody.interceptAction() - no-op')
        }
    },

    getRouteFromHREF: function (href) {
        var targetHrefMeta = url.parse(href);
        if (/\/wp-admin\/?/.test(targetHrefMeta.path)) {
            return false;
        } else if (
            this.config.captureAll

            // animate for path changes. allow native hash otherwise
            || targetHrefMeta.hash && url.parse(location.href).pathname != targetHrefMeta.pathname

            || this.contentLoader.hasPageSync(href)
            || this.contentLoader.hasPostSync(href)) {
            return targetHrefMeta.pathname
        } else {
            return false
        }
    },

    updateFlags: function () {
        var $scope = this;
        $scope.flags.asyncAnimation = parseInt(this.config.asyncAnimation) == 1;
        $scope.flags.showLoadingScreen = parseInt(this.config.showLoadingScreen) == 1;
    },

    destroyClickOverrides: function () {
        var $scope = this;
        if ($scope.clickables) $scope.clickables.off('click', null, this.$interceptAction);
        delete $scope.clickables;
    },

    createClickOverrides: function () {
        var $scope = this;
        $scope.clickables = this.$element.find('[href]').not('[data-spa-initialized]');
        $scope.clickables.on('click', this.$interceptAction);
        $scope.clickables.prop('data-spa-initialized', true);
    },

    sanitize: function () {
        var $scope = this;
        $scope.createClickOverrides();
        $scope.clickables.each(function (index, el) {
            this.setAttribute('ng-href', this.href);
        });
    },

    setupCurrentView: function () {
        var $scope = this;
        $scope.sanitize();
    },

    showLoading: function () {
        var $scope = this;
        if ($scope.flags.showLoadingScreen) {
            $scope.$loadingView.addClass($scope.loadingClassName);
        }
    },

    hideLoading: function () {
        var $scope = this;
        if ($scope.flags.showLoadingScreen) {
            $scope.$loadingView.removeClass($scope.loadingClassName);
        }
    },

    addView: function ($view, $root, callback) {
        var self = this,
            $scope = this;
        $view.one('animationend', function () {
            self.$timeout(function () {
                $view.removeClass('animate-page-in');
                $view.css({'animation-name': ''});
                $view.css({'animation-duration': ''});
                if (callback) callback();

                // init some events in case 3rd-party lib uses it for rendering
                $scope.$window.resize();
                $scope.$window.scroll();
                $scope.setupCurrentView();
            });
        });

        utils.jumpTo(0); // jump to top of screen
        $view.addClass('animate-page-in');
        $root.prepend($view);
    },

    removeView: function ($view, callback) {
        var $scope = this;
        $view.one('animationend', function () {
            $scope.$timeout(function () {
                $view.remove();
                if (callback) callback();
            })
        });

        $view.addClass('animate-page-out');
    },

    addLoadingView: function () {
        var $scope = this;
        if ($scope.flags.showLoadingScreen) {
            $scope.$element.append($scope.$loadingView);
        }
    }
};

_.defaults(BodyDirective.prototype, Module.prototype);

module.exports = BodyDirective;

