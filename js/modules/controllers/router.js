define(
    [
        'require',
        'namespace',
        'utils',
        'wordpress',
        'backbone'
    ],
    function (require) {
        var Backbone = require('backbone'),
            utils = require('utils'),
            NS = require('namespace'),
            WordPress = require('wordpress'),
            Router = Backbone.Router.extend({
                initialize: function () {
                    var routerOptions = {
                        pushState: true,
                        hashChange: false
                    };
                    if ('/' != utils.getRootPath()) routerOptions['root'] = utils.getRootPath();
                    Backbone.history.start(routerOptions);
                },
                routes: {
                    '*path': 'onRouteChange'
                },
                /**
                 *
                 * @param {string} url - A full url to navigate to
                 * @param {object} [options]
                 * @param {object} [options.trigger = true] - Whether to trigger a 'route' event or just navigate;
                 * @param {object} [options.event] - An event object. Useful for when a link has been clicked
                 * @param {object} [options.bypassUrlValidation = false] Whether to validate path with WordPress
                 */
                navigateTo: function (url, options) {
                    //console.log('Router.navigateTo() called w/', arguments);
                    var defaults = {
                            trigger: true
                        },
                        _options = Backbone.$.extend(defaults, options);
                    if (_options.bypassUrlValidation || (WordPress.hasPage(url) || WordPress.hasPost(url))) {
                        //console.log("Router.navigateTo() - navigating to page:", url);
                        this.trigger('view:request', {
                            from: location.hostname + location.pathname,
                            to: url,
                            event: _options.event
                        });
                        this.navigate(utils.getPathFromUrl(url), {
                            trigger: _options.trigger
                        });
                        /*
                         // alternate to navigate function call
                         history.pushState({}, (options && options.title)?options.title:'', url );
                         this.trigger('route', 'navigateTo', [utils.getPathFromUrl(url), from], options);
                         */
                    }
                },
                onRouteChange: function (path, arg2) {
                    console.log('Router.onRouteChange() called w/ ',arguments);
                    var url = (path) ? utils.getRootUrl(true) + path : utils.getRootUrl(false);
                    if (url == location.href) return;
                    this.navigateTo(url);
                },
                onViewReinitialized: function () {

                }
            });

        NS.Router = new Router();
        return NS.Router;
    }
);