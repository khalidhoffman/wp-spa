define([
    'require',
    'lodash',
    'state',
    'utils',
    'ng-app'
], function (require) {
    var _ = require('lodash'),
        utils = require('utils'),
        spaState = require('state'),
        ngApp = require('ng-app');

    console.log("require('content-service')");

    ngApp.service('contentService', ['$http', function ($http) {
        console.log('contentService.init()');
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
                    });

                $http.get(utils.getRootUrl(true) + '?show_sitemap', {
                    dataType: 'json'
                })
                    .then(
                        function success($response, responseStatus) {
                            var siteMap = $response.data;
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
                            if (_options.done) _options.done.apply(_options.context, [self[namespace]]);
                        },
                        function failure(response) {
                            if (_options.done) _options.done.apply(_options.context, [self[namespace]]);
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

            verify: function (type, val, options) {
                var self = this,
                    _options = _.defaults(options, {});
                this['get' + _.capitalize(type)]({
                    done: function () {
                        var requestedUrl = utils.sanitizeUrl(url),
                            list = self.get(type);
                        _options.done.call(_options.context, _.includes(list, requestedUrl));
                    }
                })

            }
        });

        this.wordpress = new WordPress;

        this._DOM = document.createElement('html');
        this._cache = [];
        this.$DOM = angular.element(self._DOM);

        /**
         *
         * @param route
         * @param {Object} [options]
         * @param {Boolean} [options.useCache=true]
         * @param {Boolean} [options.cache=true]
         * @param {Function} [options.done]
         */
        this.getHTML = function(route, options){
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
                    var $DOM= angular.element(_DOM);
                    if(_options.cache) self._cache[route]  = $DOM;
                    _options.done.call(null, null, $DOM.clone());
                }, function failure(response) {
                    var err = new Error('spaContent.http.get("' + route + '") - Failed:' + response);
                    _options.done.call(null, err);
                });
            }
        };

        return this;

    }]);
});
