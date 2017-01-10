var url = require('url'),

    $ = require('jquery'),

    // local modules
    utils = require('utils'),
    Module = require('../lib/module');

console.log("require('modules/directives/body')");

/**
 * @extends Module
 * @class AnimationController
 * @constructor
 */
function AnimationController() {
    Module.apply(this, arguments);

    var self = this,
        $scope = this;
    this.config = this.configLoader.getDefaults();
    this.$body = $('body');
    this.baseHrefRegex = new RegExp(url.parse(this.meta.baseHREF));

    $scope.mainSelector = this.configLoader.getMainSelector();
    $scope.$loadingView = $(require("raw!./../directives/html/loading-view.html"));
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
                $newContent = $body.find($scope.mainSelector),
                $activeContent = self.$body.find($scope.mainSelector);

            console.log('body.view:update - new $spaContent: %o', $newContent);

            $scope.showLoading();
            if ($scope.flags.asyncAnimation) {
                $scope.removePage($activeContent);
                $scope.addPage($newContent, $body[0].attributes, function () {
                    $scope.hideLoading();
                });
            } else {
                $scope.removePage($activeContent, function () {
                    $scope.addPage($newContent, $body[0].attributes, function () {
                        $scope.hideLoading();
                    });
                });

            }

        });
    });
}

AnimationController.prototype = {

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
        $scope.clickables = this.$body.find('[href]').not('[data-spa-initialized]');
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

    addPage: function ($page, attrs, callback) {
        var self = this,
            $scope = this;

        $page.one('animationend', function () {
            self.$timeout(function () {
                $page.removeClass('animate-page-in');
                $page.css({
                    'animation-duration': '',
                    'animation-name': ''
                });
                if (callback) callback();

                // init some events in case 3rd-party lib uses it for rendering
                $scope.$window.resize();
                $scope.$window.scroll();
                $scope.setupCurrentView();
            });
        });

        utils.jumpTo(0); // jump to top of screen

        // update DOM.body
        var attr,
            attrIdx = 0;
        while(attr = attrs[attrIdx++]){
            self.$body.attr(attr.name, attr.value);
        }
        this.$timeout(function(){
            $page.css({
                'animation-name': self.config.animationInName,
                'animation-duration': self.config.animationInDuration + 'ms'
            });
            self.$root.prepend($page);
            $page.addClass('animate-page-in');
        });
    },

    removePage: function ($page, callback) {
        var self = this,
            $view = $page.find('.spa-content__view');

        // adjust for clipped view
        $view.css({
            'margin-top': this.$window.scrollTop() * -1
        });

        $page.css({
            'min-height': '100vh',
            'overflow': 'hidden',
            'animation-duration': this.config.animationOutDuration + 'ms'
        });

        $page.one('animationend', function () {
            self.$timeout(function () {
                $page.remove();
                if (callback) callback();
            })
        });

        // allow overflow rendering first
        this.$timeout(function () {
            $page.css({
                'animation-name': self.config.animationOutName
            });
            $page.addClass('animate-page-out');
        });
    },

    addLoadingView: function () {
        var $scope = this;
        if ($scope.flags.showLoadingScreen) {
            $scope.$body.append($scope.$loadingView);
        }
    }
};

utils.defaults(AnimationController.prototype, Module.prototype);

module.exports = AnimationController;

