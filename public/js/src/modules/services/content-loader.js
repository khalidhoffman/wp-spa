var _ = require('lodash'),
    utils = require('utils'),
    spaState = require('state'),
    ngApp = require('ng-app');

console.log("require('content-service')");

ngApp.service('contentLoader', ['$http', function ($http) {
    console.log('contentLoader.init()');
    var self = this;

    var WordPress = Backbone.Model.extend({
        defaults: {
            pages: [],
            posts: [],
            record: [],
            ready: false
        },
        initialize: function () {
            this.downloadSiteMap();
        },
        isReady: function () {
            return this.get('isReady');
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
                siteMapURL = utils.getRootUrl(true) + '?show_json_sitemap';

            $http.get(siteMapURL, {dataType: 'json'}).then(
                function success(response) {
                    var siteMap = response.data;
                    console.log('WordPress downloaded sitemap data: ', siteMap);
                    _.forEach(siteMap, function (hrefs, post_type, arr) {
                        //console.log('WordPress is processing: ',arguments);
                        switch (post_type) {
                            case 'page':
                                self.set('pages', hrefs);
                                break;
                            case 'archive':
                                break;
                            default:
                                self.set('posts', _.uniq(self.get('posts').concat(hrefs)));
                        }
                    });
                    //console.log('WordPress processed sitemap data: ', self);
                    self.set('isReady', true);
                    if (_options.done) _options.done.call(_options.context);
                },
                function failure(response) {
                    var siteMapFetchError = new Error("Could not fetch sitemap");
                    console.error(siteMapFetchError);
                    if (_options.done) _options.done.call(_options.context, siteMapFetchError, response);
                }
            );
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
                this.once('change:isReady', function () {
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
                this.once('change:isReady', function () {
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
    });

    this.wordpress = new WordPress;

    this._cache = [];

    /**
     *
     * @param route
     * @param {Object} [options]
     * @param {Boolean} [options.useCache=true]
     * @param {Boolean} [options.cache=true]
     * @param {Function} [options.done]
     */
    this.getHTML = function (route, options) {
        var _options = _.defaults(options, {
            useCache: spaState.get('useCache'),
            cache: spaState.get('useCache')
        });
        if (_options.useCache && self._cache[route]) {
            var $DOM = self._cache[route].clone();
            console.log('spaContent._cache[%s] = (%O)', route, $DOM);
            _options.done.call(null, null, $DOM);
        } else {
            $http.get(route).then(function success(response) {
                console.log('spaContent.$http.get.success(%O)', response);
                var _DOM = document.createElement('html');
                _DOM.innerHTML = response.data;
                var $DOM = angular.element(_DOM);
                if (_options.cache) self._cache[route] = $DOM;
                _options.done.call(null, null, $DOM.clone());
            }, function failure(response) {
                var err = new Error('spaContent.http.get("' + route + '") - Failed:' + response);
                _options.done.call(null, err);
            });
        }
    };

    return this;

}]);
