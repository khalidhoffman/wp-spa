var _ = require('lodash'),
    $ = require('jquery'),
    url = require('url'),
    utils = require('utils'),
    Module = require('../lib/module');

console.log("require('content-service')");

function ContentLoader() {
    Module.apply(this, arguments);
    this.data = {
        pages: [],
        posts: []
    };
    this._cache = [];
    this.downloadSiteMap();
};

ContentLoader.prototype = {
    get: function (path) {
        return _.get(this.data, path);
    },
    set: function (path, value) {
        return _.set(this.data, path, value)
    },
    isReady: function () {
        return this.get('isReady');
    },

    /**
     *
     * @param route
     * @param {Object} [options]
     * @param {Boolean} [options.useCache=false]
     * @param {Boolean} [options.reusePages=false]
     * @param {Function} [options.done]
     */
    getHTML: function (route, options) {
        var self = this,
            opts = _.defaults(options, {});
        if (opts.useCache && self._cache[route]) {
            var $DOM = opts.reusePages ? self._cache[route] : self._cache[route].clone();
            console.log('spaContent._cache[%s] = (%O)', route, $DOM);
            opts.done.call(null, null, $DOM);
        } else {
            $.ajax({
                url: /^http/.test(route) ? route : url.resolve(self.meta.baseHREF, route),
                success: function (response) {
                    console.log('spaContent.$http.get.success(%O)', response);
                    var _DOM = document.createElement('html');
                    _DOM.innerHTML = response;
                    var $DOM = $(_DOM);
                    if (opts.cache) self._cache[route] = $DOM;
                    opts.done.call(null, null, opts.reusePages ? $DOM : $DOM.clone());
                },
                failure: function (response) {
                    var err = new Error('spaContent.http.get("' + route + '") - Failed:' + response);
                    opts.done.call(null, err);
                }
            });
        }
    },
    /**
     *
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    downloadSiteMap: function (options) {
        var self = this,
            _options = _.defaults(options, {
                context: self
            }),
            siteMapURL = utils.getRootUrl() + '?wp_spa_sitemap';

        $.ajax({
            url: siteMapURL,
            dataType: 'json',
            json: true,
            success: function (response) {
                var siteMap = response;
                console.log('WordPress downloaded sitemap data: ', siteMap);
                _.forEach(siteMap, function (hrefs, post_type) {
                    //console.log('WordPress is processing: ',arguments);
                    switch (post_type) {
                        case 'page':
                            self.set('pages', hrefs);
                            break;
                        case 'archive':
                            break;
                        default:
                            self.set('posts', hrefs);
                    }
                });
                //console.log('WordPress processed sitemap data: ', self);
                self.set('isReady', true);
                self.$broadcast('wordpress:init');
                if (_options.done) _options.done.call(_options.context);
            },
            failure: function (response) {
                var siteMapFetchError = new Error("Could not fetch sitemap");
                console.error(siteMapFetchError);
                if (_options.done) _options.done.call(_options.context, siteMapFetchError, response);
            }
        });
    },

    /**
     *
     * @param {Object} [options]
     * @param {Object} [options.context]
     * @param {Function} [options.done]
     * @returns {[String]}
     */
    getPages: function (options) {
        var _options = _.defaults(options, {});
        if (this.isReady()) {
            _options.done.call(_options.context, this.get('pages'))
        } else {
            this.$on('wordpress:init', function () {
                _options.done.call(_options.context, this.get('pages'))
            });
        }
    },

    /**
     *
     * @param {Object} [options]
     * @param {Function} [options.done]
     * @returns {[String]}
     */
    getPosts: function (options) {
        var _options = _.defaults(options, {});
        if (this.isReady()) {
            _options.done.call(_options.context, this.get('pages'))
        } else {
            this.$on('wordpress:init', function () {
                _options.done.call(_options.context, this.get('pages'))
            });
        }
    },

    /**
     *
     * @param url
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    hasPage: function (url, options) {
        this.verify('pages', url, options);
    },

    /**
     *
     * @param requestedURL
     * @returns {boolean}
     */
    hasPageSync: function (requestedURL) {
        return _.includes(this.get('pages'), requestedURL);
    },

    /**
     *
     * @param url
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    hasPost: function (url, options) {
        this.verify('posts', url, options);
    },

    /**
     *
     * @param requestedURL
     * @returns {boolean}
     */
    hasPostSync: function (requestedURL) {
        return _.includes(this.get('posts'), requestedURL);
    },

    verify: function (type, url, options) {
        var self = this,
            _options = _.defaults(options, {}),
            verificationMethod = this['get' + _.capitalize(type)];

        verificationMethod.call(this, {
            done: function (urls) {
                var requestedUrl = utils.sanitizeUrl(url);
                if (_options.done) _options.done.call(_options.context, _.includes(urls, requestedUrl));
            }
        });
    }
};

_.defaults(ContentLoader.prototype, Module.prototype);

module.exports = ContentLoader;
