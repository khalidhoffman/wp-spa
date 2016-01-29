define(
    [
        'require',
        'backbone',
        '$elements',
        'router',
        'utils',
        'wordpress',
        'namespace',
        'pages-stub',
        'text!modules/views.json',
        'dom-scripts',
        'videojs',
        'domReady!'
    ],
    function (require) {
        var Backbone = require('backbone'),
            NS = require('namespace'),
            utils = require('utils'),
            $elements = require('$elements'),
            Router = require('router'),
            WordPress = require('wordpress'),
            animationEndEvents = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',
            pageModules = JSON.parse(require('text!modules/views.json')),
            CurrentPageView = Backbone.View.extend({
                initialize: function () {
                    var self = this;
                    this.$activeView = this.$(this.settings.activeViewSelector);
                    this.$wpMeta = $elements.wpMeta;
                    this.$head = $elements.html.find('head');
                    this.domParser = new DOMParser();
                    this._initializeChildView();
                    this.listenTo(Router, 'route', function (caller, routeInfo) {
                        //console.log("CurrentPageView.listenTo('route') called w/ ", arguments);
                        self.fetchPath(routeInfo[0])
                    });
                    this.listenTo(Router, 'view:insert', this._onActiveViewIn);
                    this.listenTo(Router, 'view:removed', this._onActiveViewOut);
                    this.startMonitoringViewClicks();
                },
                settings: {
                    activeViewAnimateOutClassName: 'animate-active-view-out',
                    parentViewAnimateOutClassName: 'animate-parent-out',
                    activeViewAnimateInClassName: 'animate-active-view-in',
                    parentViewAnimateInClassName: 'animate-parent-in',
                    activeViewWrapSelector: '.wrap-view-active',
                    activeViewSelector: '#view-active',
                    childViewElSelector: ' > div'
                },
                state: {
                    activeViewIn: false,
                    activeViewOut: false,
                    isLinkWatching : false
                },
                viewModules: pageModules,
                /**
                 *
                 * @param {string} urlPath - A string without a prefixed slash
                 */
                fetchPath: function (urlPath) {
                    var self = this,
                        fullPath = utils.getRootUrl(true) + (urlPath || '');
                    Backbone.$.ajax({
                        url: fullPath,
                        complete: function ($response, responseStatus) {
                            //console.log('currentPage.fetchPath('+fullPath+'): ', arguments);
                            var DOM = null;
                            try {
                                DOM = self.domParser.parseFromString($response.responseText, "text/html");
                            } catch (err) {
                                if (err) console.error(e);
                                DOM = Backbone.$($response.responseText);
                            }
                            self.displayDOM(DOM);
                        }
                    });
                },
                /**
                 *
                 * @param DOM
                 */
                displayDOM: function (DOM) {
                    var self = this,
                        $DOM = (DOM.jquery) ? DOM : Backbone.$(DOM),
                        $oldActiveView = this.$activeView,
                        $newActiveView = $DOM.find(this.settings.activeViewSelector);

                    this.state.activeViewIn = false;
                    this.state.activeViewOut = false;

                    function _trigger(eventIdentifier, options) {
                        _options = options || {};
                        Router.trigger(eventIdentifier, {
                            $from: _options.$from || $oldActiveView,
                            $to: _options.$to || $newActiveView,
                            $toDOM: _options.$toDOM || $DOM
                        });
                    }

                    function onActiveViewOut() {
                        self.state.activeViewOut = true;
                        if (self.state.activeViewIn && self.state.activeViewOut) {
                            _trigger('view:removed');
                        } else {
                            console.log('childView enter animation %s complete.', (self.state.activeViewIn) ? 'is' : 'is not');
                            self.listenToOnce(Router, 'view:insert', function () {
                                _trigger('view:removed');
                            })
                        }
                    }

                    function onActiveViewIn() {
                        self.state.activeViewIn = true;
                        _trigger('view:insert');
                    }

                    function updatePageReferences(){
                        $newActiveView.attr('data-slug', Backbone.history.getFragment());
                        document.title = $DOM.find('head title').text();
                        var $newWPMeta = $DOM.find('#wp-meta');
                        window.WP_Meta = $newWPMeta.data('wordpress');
                        self.$wpMeta.replaceWith($newWPMeta);
                        self.$activeView = $newActiveView;
                        _trigger('view:linked');
                    }

                    if (Modernizr.cssanimations) {

                        // setup animation page listeners
                        $oldActiveView.one(animationEndEvents, onActiveViewOut);
                        $newActiveView.one(animationEndEvents, onActiveViewIn);

                        // attach new view
                        $newActiveView.insertAfter($oldActiveView);
                        _trigger('view:attached');

                        updatePageReferences();

                        // init page animation state
                        self.$el.addClass('transitioning');
                        Router.trigger('view:transitioning', {
                            $from: $oldActiveView,
                            $to: $newActiveView,
                            $toDOM: $DOM
                        });
                        utils.jumpTo(self.$el);

                        // start previous view exit animation
                        self.$el.addClass(self.settings.parentViewAnimateOutClassName);
                        $oldActiveView.addClass(self.settings.activeViewAnimateOutClassName);

                        // start new view entry animation
                        self.$el.addClass(self.settings.parentViewAnimateInClassName);
                        $newActiveView.addClass(self.settings.activeViewAnimateInClassName);

                    } else {
                        // no transition animation

                        // update new page content
                        this.$activeView.replaceWith($newActiveView);
                        updatePageReferences();
                        onActiveViewOut();
                        onActiveViewIn();
                    }
                },
                startMonitoringViewClicks : function(){
                    var self = this;
                    this.$watchedLinks = Backbone.$('a[href*="'+utils.getRootUrl({trailingSlash : false})+'"]');
                    this.siteClickListener = function(){
                        self._onViewClick.apply(self, arguments);
                    };
                    this.$watchedLinks.on('click', this.siteClickListener);
                    this.state.isLinkWatching = true;
                },
                stopMonitoringViewClicks : function(){
                    this.$watchedLinks.off('click', null, this.siteClickListener); // It should be okay to remove all listeners since page is effectively reset
                    this.state.isLinkWatching = false;
                },
                _resetViewClickListeners : function(){
                    this.stopMonitoringViewClicks();
                    this.startMonitoringViewClicks();
                },
                _onViewClick : function(evt){
                    var url = evt.currentTarget.href;
                    console.trace('click');
                    if((WordPress.hasPage(url) || WordPress.hasPost(url))){
                        if(evt && evt.preventDefault) evt.preventDefault();
                        if(url != location.href) this.stopMonitoringViewClicks();
                        Router.navigateTo(url,{
                            bypassUrlValidation : true,
                            event : evt
                        });
                    } else {
                        console.log('leaving wordpress site')
                    }
                },
                _onActiveViewIn: function (data) {
                    console.log('ActiveView._onActiveViewIn(%O)', data);
                    var $newPageContainer;
                    if (data && data.$to) {
                        $newPageContainer = data.$to;
                    } else {
                        throw new Error('_onActiveViewIn called without proper data object');
                    }

                    Router.trigger('view:replaced', {
                        $from: null,
                        $to: $newPageContainer
                    });
                    $newPageContainer.off();
                    $newPageContainer.removeClass(this.settings.activeViewAnimateInClassName);
                    this.$el.removeClass('transitioning');
                    this.$el.removeClass(this.settings.parentViewAnimateInClassName);
                },
                _onActiveViewOut: function (data) {
                    console.log('ActiveView._onActiveViewOut(%O)', data);
                    var $oldPageContainer,
                        $DOM;
                    if (data && data.$from && data.$toDOM) {
                        $oldPageContainer = data.$from;
                        $DOM = data.$toDOM;
                    } else {
                        throw new Error('_onActiveViewOut called without proper data object');
                    }

                    //remove old page
                    $oldPageContainer.off();
                    $oldPageContainer.detach();
                    this._destroyView();
                    $oldPageContainer.remove();

                    // update DOM
                    this.$el.attr('class', $DOM.find('body').attr('class'));
                    this.$el.attr('data-template', $DOM.find('body').data('template'));
                    this.$head.find('meta').remove();
                    this.$head.prepend($DOM.find('head meta'));

                    // updatePageReferences
                    this._resetViewClickListeners();
                    this._initializeChildView();
                },
                _destroyView: function () {
                    var self = this;
                    // destroy pages
                    Router.trigger('view:pre-destroy');
                    if (this.childView && this.childView.onDestroy) {
                        this.childView.onDestroy.apply(this.childView);
                    }
                    Router.trigger('view:post-destroy');

                    delete this.childView;
                    Router.trigger('view:undefined');
                },
                _initializeChildView: function () {
                    var self = this,
                        $viewModuleElement,
                        View,
                        currentModuleName;
                    _.forEach(self.viewModules, function (viewModuleName, index, arr) {
                        currentModuleName = 'pages/' + self.$el.attr('data-template');
                        console.log('Does %s == %s? %s', currentModuleName, viewModuleName, currentModuleName == viewModuleName);
                        if (currentModuleName == viewModuleName) {
                            $viewModuleElement = self.$(self.settings.activeViewSelector + self.settings.childViewElSelector);
                            View = require(viewModuleName);
                            self.childView = new View({el: $viewModuleElement[0]});
                        }
                    });
                    if (!self.childView) self.childView = false;
                    Router.trigger('view:defined');
                }

            });

        var el = Backbone.$('body')[0];
        NS.CurrentPageView = (el) ? new CurrentPageView({el: el}) : CurrentPageView;
        return NS.CurrentPageView;
    }
);