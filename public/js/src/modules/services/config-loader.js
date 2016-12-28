var _ = require('lodash'),
    utils = require('utils'),
    $ = require('jquery'),
    ngApp = require('ng-app');

console.log("require('content-service')");

ngApp.service('configLoader', [
    '$http',
    function ($http) {
        var self = this;
        this._data = {};
        this.dataPath = '/wp-content/plugins/wp-spa/data/wp-spa.config.json';
        this.baseURL = $("base").attr('href');
        this.localConfigURL = this.baseURL + this.dataPath;

        this.getMainSelector = function () {
            return '.spa-content__content';
        };

        this.getConfig = function(callback, options){
            if (this._data.mainSelector){
                if (callback) callback(null, this._data);
            } else {
                this.fetchConfig(callback);
            }
        };

        /**
         *
         * @param {Function} [callback]
         * @param {Object} [options]
         */
        this.fetchConfig = function(callback, options){
            $http.get(this.localConfigURL).then(
                function success(result) {
                    self._data = result.data;
                    console.log('response: %o', result);
                    if (callback) callback(null, self._data);
                },
                function failure() {
                    console.error('response: %o', result);
                    if (callback) callback(new Error("Could not fetch config"), result);
                });
        };

        function init(){
            self.fetchConfig();
        }


        init();
    }
]);
