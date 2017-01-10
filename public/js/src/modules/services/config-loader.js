var utils = require('utils'),
    $ = require('jquery'),

    Module = require('../lib/module');

console.log("require('content-service')");
function ConfigLoader() {
    Module.apply(this, arguments);
    this._state = {
        hasLoaded: false
    };

    this._defaults = utils.defaults({}, this.getDefaults());

    // use defaults for now
    this._data = this._defaults;

    this.configURL = utils.getRootUrl() + '?wp_spa_config';
    this.fetchConfig();
}

ConfigLoader.prototype = {

    getMainSelector: function () {
        return '.spa-content__page';
    },

    getDefaults: function () {
        return {
            animationInName: 'fadeIn',
            animationOutName: 'fadeOut',
            animationInDuration: 400,
            animationOutDuration: 400,
            useCache: 1,
            reusePages: 0,
            asyncAnimation: 1,
            captureAll: false
        };
    },

    /**
     *
     * @param {Function} [callback]
     * @param {Object} [options]
     * @param {Boolean} [options.forceUpdate]
     */
    fetchConfig: function (callback, options) {
        var self = this,
            opts = utils.defaults(options, {});
        if (self._state.hasLoaded && !opts.forceUpdate) {
            if (callback) callback(null, this._data);
        } else {
            $.ajax({
                url: this.configURL,
                dataType: 'json',
                json: true,
                success: function success(response) {
                    self._data = JSON.parse(response);
                    console.log('config response: %o', arguments);
                    self._state.hasLoaded = true;
                    // hotfix to check for valid config
                    if (self._data.animationInName) {
                        if (callback) callback(null, self._data);
                    } else {
                        if (callback) callback(null, self._defaults);
                    }
                },
                error: function failure(response) {
                    console.error('response: %o', response);
                    if (callback) callback(new Error("Could not fetch config"), response);
                }
            });
        }
    }
};

utils.defaults(ConfigLoader.prototype, Module.prototype);

module.exports = ConfigLoader;
