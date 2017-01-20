var url = require('url'),

    $ = require('jquery'),

    // local modules
    utils = require('utils'),
    Module = require('../lib/module'),
    LoadingView = require("../views/loading"),

    // jquery plugins
    oneStrict = require('../views/jquery.one-strict'),
    prependedCSS = require('../views/jquery.prepended-css');

console.log("require('modules/directives/body')");

/**
 * @extends Module
 * @class UIController
 * @constructor
 */
function UIController() {
    Module.apply(this, arguments);

    var self = this;
    this.config = utils.defaults(this.configLoader.getDefaults(), {
        timeout: 2000
    });
    this.$body = $('body');

    this.mainSelector = this.configLoader.getMainSelector();
    this.flags = {};
    this.updateConfiguration();

    this._interceptAction = this.interceptAction.bind(this);


    this.loadingView = new LoadingView({
        indicatorType: this.$root.data('wp-spa-loader-type'),
        indicatorColor: this.$root.data('wp-spa-loader-color')
    });
    if (this.flags.showLoadingScreen) {

        this.loadingView.appendTo(this.$body);

        // make use off css transition to smooth loading intro
        this.loadingView.show(0);
        this.$timeout(function () {
            self.loadingView.show(50);
        })
    }
    this.execOnIdleTimed(function () {

        // show animation on first render
        self.addPage(self.$body.find('.spa-content__page'), self.$body[0].attributes, function () {
            self.loadingView.hide();

            // start pre-caching
            self.contentLoader.preCache();
        });
    }, 12 * 1000);

    this.configLoader.fetchConfig(function (err, configData) {
        self.config = utils.defaults(configData, self.config);

        self.updateConfiguration();
        self.hookIntoPage(self.$body);

        self.$on('head:update', function (event, data) {
            var $DOM = data.$DOM,
                $body = $DOM.find('body'),
                $newContent = $body.find(self.mainSelector),
                $activeContent = self.$body.find(self.mainSelector);

            console.log('body.view:update - new $spaContent: %o', $newContent);

            self.loadingView.show(0);
            self.unHook();
            if (self.flags.asyncAnimation) {
                self.removePage($activeContent);
                self.addPage($newContent, $body[0].attributes, function () {
                    self.loadingView.hide();
                });
            } else {
                self.removePage($activeContent, function () {
                    self.loadingView.show(50);
                    self.addPage($newContent, $body[0].attributes, function () {
                        self.loadingView.hide();
                    });
                });
            }
        });
    });
}

UIController.prototype = {

    interceptAction: function (evt) {
        console.log('ngBody.interceptAction()');
        var self = this,
            targetHref = evt.currentTarget.href || location.href,
            route = this.getRouteFromHREF(targetHref);

        if (route) {
            console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(targetHref));
            evt.preventDefault();
            if (route == '@') {
                // attempting route to current page
                this.shake();
            } else {
                self.router.path(route);
            }
        } else {
            console.log('ngBody.interceptAction() - no-op');
        }
    },

    getRouteFromHREF: function (href) {
        var targetHrefMeta = url.parse(href);
        if (/\/wp\-(admin|login)\/?/.test(targetHrefMeta.path)) {
            return false;
        } else if (location.href.match(new RegExp(targetHrefMeta.pathname + '\/?$'))) {
            return '@';
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

    updateAnimationOptions: function () {
        this.flags.enforceSmooth = parseInt(this.config.enforceSmooth) === 1;
        this.flags.asyncAnimation = parseInt(this.config.asyncAnimation) === 1;
        this.flags.useScreenClip = parseInt(this.config.useScreenClip) === 1;
        this.flags.showLoadingScreen = !!this.$root.attr('data-wp-spa-loader-type');
    },

    updateExecutionMethod: function(){
        this.exec = this.flags.enforceSmooth ? this.execOnIdle : this.execImmediate;
    },

    updateConfiguration: function(){
        this.updateAnimationOptions();
        this.updateExecutionMethod();
    },

    destroyClickOverrides: function () {
        if (this.clickables) this.clickables.off('click', null, this._interceptAction);
        delete this.clickables;
    },

    createClickOverrides: function ($page) {
        this.clickables = $page.find('[href]').not('[data-spa-initialized]');
        this.clickables.on('click', this._interceptAction);
        this.clickables.attr('data-spa-initialized', true);
    },

    shake: function () {
        var self = this;
        this.$root.oneTimeout('animationend', function () {
            self.$root.removeClass('spa-content--shake');
        }, 3000);
        this.$root.addClass('spa-content--shake');
    },

    hookIntoPage: function ($page) {
        this.createClickOverrides($page);
    },

    execOnIdleTimed: function(callback, duration){
        var isCallbackClean = true,
            timeoutId,
            strictCallback = function () {
                clearTimeout(timeoutId);
                if (isCallbackClean) callback();
            };

        this.resourceMonitor.once(strictCallback);

        timeoutId = setTimeout(function () {
            isCallbackClean = false;
            callback();
        }, duration);
    },

    execOnIdle: function(callback){
        return this.resourceMonitor.once(callback);
    },

    execImmediate: function(callback){
        return this.$timeout(callback);
    },

    unHook: function () {
        this.destroyClickOverrides()
    },

    addPage: function ($page, attrs, callback) {
        var self = this,
            $view = $page.find('.spa-content__view'),
            attrIdx = 0,
            bodyClasses,
            attr;

        this.hookIntoPage($page);

        var startAnimationEndWatch = $page.oneDelayedTimeout('animationend', function () {
            self.$timeout(function () {
                // restore classes to normal
                self.$body.attr('class', bodyClasses);
                $view.removeClass(bodyClasses);
                $page.removeClass('animate-page-in')
                    .css({

                        'animation-duration': '',
                        'animation-name': ''
                    });

                if (callback) callback();

                // init some events in case 3rd-party lib uses it for rendering
                self.$window.resize();
                self.$window.scroll();
            });
        }, parseInt(this.config.animationInDuration) + this.config.timeout);

        while (attr = attrs[attrIdx++]) {
            switch (attr.name) {
                case 'class':

                    // copy body classNames to view element and clear body
                    // we'll add the classes to the body once the animation is complete
                    this.$body.attr(attr.name, '');
                    bodyClasses = attr.value;
                    $view.addClass(bodyClasses);
                    break;

                default:
                    this.$body.attr(attr.name, attr.value);
            }
        }

        // set page properties
        if (this.flags.useScreenClip) {
            $page.addClass('animate-page-in--clipped');
        } else {
            $page.removeClass('animate-page-in--clipped');
        }

        $page.css({'display': 'none'})
            .addClass('animate-page-in');

        // attach to dom if page isn't already
        if (!($.contains(document, $page[0]))) {
            this.$root.prepend($page);
        }

        this.exec(function () {

            // jump to top of screen
            // helps keep transitions between pages seamless
            utils.jumpTo(0);

            // remove clipped view if needed
            $page.removeClass('animate-page-in--clipped');

            startAnimationEndWatch();

            // play animation
            $page.css({
                'display': '',
                'animation-name': self.config.animationInName,
                'animation-duration': self.config.animationInDuration + 'ms'
            });
        });
    },

    removePage: function ($page, callback) {
        var self = this,
            $view = $page.find('.spa-content__view'),
            bodyClassNames = this.$body.attr('class');

        // adjust for clipped view
        // possibly provides relief from flicker
        if (this.flags.useScreenClip) {
            this.$root.prependedCSS([
                {
                    selector: '.animate-page-out.animate-page-out--clipped .spa-content__view',
                    styles: {
                        'margin-top': this.$window.scrollTop() * -1 + 'px'
                    }
                },
                {
                    selector: '.animate-page-out.animate-page-out--clipped',
                    styles: {
                        'animation-name': 'none',
                        'min-height': '100vh',
                        'overflow': 'hidden'
                    }
                }
            ]);
            $page.addClass('animate-page-out--clipped');

            // jump to top of screen
            // helps keep transitions between pages seamless
            utils.jumpTo(0);
        } else {
            $page.removeClass('animate-page-out--clipped');
            this.$root.prependedCSS([
                {
                    selector: '.animate-page-out',
                    styles: {
                        'animation-name': 'none'
                    }
                }
            ]);
        }
        $page.addClass('animate-page-out');

        var startAnimationEndWatch = $page.oneDelayedTimeout('animationend', function () {
            //$page.remove();
            //self.$root.prependedCSS('remove');
            //if (callback) callback();

            $page.remove();
            if (callback) callback();
            if (self.flags.useScreenClip) self.$root.prependedCSS('remove');

        }, parseInt(this.config.animationOutDuration) + this.config.timeout);

        // duplicate body classNames to $page scope
        $view.addClass(bodyClassNames);

        // allow overflow rendering first
        this.exec(function () {
            startAnimationEndWatch();
            $page.css({
                'animation-name': self.config.animationOutName,
                'animation-duration': self.config.animationOutDuration + 'ms'
            });
        });
    }
};

utils.defaults(UIController.prototype, Module.prototype);

module.exports = UIController;

