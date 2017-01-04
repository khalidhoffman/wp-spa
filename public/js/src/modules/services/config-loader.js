var _ = require('lodash'),
    utils = require('utils'),
    ngApp = require('ng-app');

console.log("require('content-service')");

ngApp.service('configLoader', [
    '$http',
    function ($http) {
        var self = this,
            defaults = {
                animationInName: 'fadeIn',
                animationOutName: 'fadeOut',
                animationInDuration: 400,
                animationOutDuration: 400,
                useCache: 1,
                reusePages: 0,
                asyncAnimation: 1
            };
        this._state = {
            hasLoaded: false
        };

        this._defaults = _.defaults({}, defaults);

        // use defaults for now
        this._data = this._defaults;

        this.configURL = utils.getRootUrl() + '?wp_spa_config';

        this.getMainSelector = function () {
            return '.spa-content__content';
        };

        this.getDefaults = function () {
            return defaults;
        };

        /**
         *
         * @param {Function} [callback]
         * @param {Object} [options]
         * @param {Boolean} [options.forceUpdate]
         */
        this.fetchConfig = function (callback, options) {
            var self = this,
                opts = _.defaults(options, {});
            if (self._state.hasLoaded && !opts.forceUpdate) {
                if (callback) callback(null, this._data);
            } else {
                $http.get(this.configURL, {responseType: 'json'}).then(
                    function success(response) {
                        self._data = response.data;
                        console.log('config response: %o', response);
                        self._state.hasLoaded = true;
                        // hotfix to check for valid config
                        if (self._data.animationInName) {
                            if (callback) callback(null, self._data);
                        } else {
                            if (callback) callback(null, self._defaults);
                        }
                    },
                    function failure(response) {
                        console.error('response: %o', response);
                        if (callback) callback(new Error("Could not fetch config"), response);
                    });
            }
        };

        function init() {
            self.fetchConfig();
        }


        init();
    }
]);
