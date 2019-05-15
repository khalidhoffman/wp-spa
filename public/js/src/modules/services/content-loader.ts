import * as $     from 'jquery';
import * as url   from 'url';

import * as utils from '../lib/utils';
import { Module } from '../lib/module';

export class ContentLoader extends Module {
    data: IContentLoaderDataRegistry;
    private _cache: IContentLoaderCache;

    constructor(app: IApplication) {
        super(app);
        this.data = {
            pages: [],
            posts: []
        };
        this._cache = {};
        this.downloadSiteMap();
    }

    get(path) {
        return this.data[path];
    }

    set(path, value) {
        return this.data[path] = value;
    }

    isReady() {
        return this.get('isReady');
    }

    preCache(idx) {
        idx = idx || 0;
        var route = this.get('posts')[idx];
        if (route) this.getHTML(url.parse(route).pathname, { useCache: true });
        return this.get('posts')[idx + 1] ? this.preCache(idx + 1) : null;
    }

    /**
     *
     * @param route
     * @param {Object} [options]
     * @param {Boolean} [options.useCache=false]
     * @param {Boolean} [options.reusePages=false]
     * @param {Function} [options.done]
     */
    getHTML(route, options) {
        var self = this,
            opts = utils.defaults(options, {});
        if (opts.useCache && self._cache[route]) {
            var $DOM = opts.reusePages ? self._cache[route] : self._cache[route].clone();
            console.log('spaContent._cache[%s] = (%O)', route, $DOM);
            if (opts.done) opts.done.call(null, null, $DOM);
        } else {
            $.ajax({
                url: /^http/.test(route) ? route : url.resolve(self.meta.baseHREF, route),
                success: function (response) {
                    console.log('spaContent.$http.get.success(%O)', response);
                    var _DOM = document.createElement('html');
                    _DOM.innerHTML = response;
                    var $DOM = $(_DOM);
                    if (opts.useCache) self._cache[route] = $DOM;
                    if (opts.done) opts.done.call(null, null, opts.reusePages ? $DOM : $DOM.clone());
                },
                failure: function (response) {
                    var err = new Error('spaContent.http.get("' + route + '") - Failed:' + response);
                    if (opts.done) opts.done.call(null, err);
                }
            });
        }
    }

    /**
     *
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    downloadSiteMap(options?: { done?: Function }) {
        var self = this,
            _options = utils.defaults(options, {
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
                for (var postType in siteMap) {
                    if (siteMap.hasOwnProperty(postType)) {
                        switch (postType) {
                            case 'page':
                                self.set('pages', siteMap[postType]);
                                break;
                            default:
                                self.set('posts', siteMap[postType]);
                        }
                    }
                }
                //console.log('WordPress processed sitemap data: ', self);
                self.set('isReady', true);
                self.$broadcast('wordpress:init');
                if (_options.done) _options.done.call(_options.context);
            },
            failure: function (response) {
                var siteMapFetchError = new Error('Could not fetch sitemap');
                console.error(siteMapFetchError);
                if (_options.done) _options.done.call(_options.context, siteMapFetchError, response);
            }
        });
    }

    /**
     *
     * @param {Object} [options]
     * @param {Object} [options.context]
     * @param {Function} [options.done]
     * @returns {[String]}
     */
    getPages(options?: { done?: Function, context?: any }) {
        var _options = utils.defaults(options, {});
        if (this.isReady()) {
            _options.done.call(_options.context, this.get('pages'))
        } else {
            this.$on('wordpress:init', function () {
                _options.done.call(_options.context, this.get('pages'))
            });
        }
    }

    /**
     *
     * @param {Object} [options]
     * @param {Function} [options.done]
     * @returns {[String]}
     */
    getPosts(options?: { done?: Function }) {
        var _options = utils.defaults(options, {});
        if (this.isReady()) {
            _options.done.call(_options.context, this.get('pages'))
        } else {
            this.$on('wordpress:init', function () {
                _options.done.call(_options.context, this.get('pages'))
            });
        }
    }

    /**
     *
     * @param url
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    hasPage(url: string, options?: { done?: Function }) {
        this.verify('pages', url, options);
    }

    /**
     *
     * @param requestedURL
     * @returns {boolean}
     */
    hasPageSync(requestedURL: string): boolean {
        return this.get('pages').indexOf(requestedURL) >= 0;
    }

    /**
     *
     * @param url
     * @param {Object} [options]
     * @param {Function} [options.done]
     */
    hasPost(url: string, options?: { done?: Function }) {
        this.verify('posts', url, options);
    }

    /**
     *
     * @param requestedURL
     * @returns {boolean}
     */
    hasPostSync(requestedURL) {
        return this.get('posts').indexOf(requestedURL) >= 0;
    }

    verify(type: string, url: string, options?: { done?: Function }) {
        const self = this;
        const _options = utils.defaults(options, {});
        const verificationMethod = this['get' + type[0].toUpperCase() + type.substr(1)];

        verificationMethod.call(this, {
            done: function (urls) {
                var requestedUrl = utils.sanitizeUrl(url);
                if (_options.done) _options.done.call(_options.context, urls.indexOf(requestedUrl) >= 0);
            }
        });
    }
}

module.exports = ContentLoader;
