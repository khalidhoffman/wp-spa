var utils = require('utils'),
    $ = require('jquery');

import { Module } from '../lib/module';

console.log("require('content-service')");

interface IConfigLoaderState {
    flag: string;
}

type IConfigLoaderData = any

type ConfigLoaderCallback = (error: Error | null, self: ConfigLoader, data?: IConfigLoaderData) => any;

export class ConfigLoader extends Module {
    private _state: IConfigLoaderState;
    private _data: IConfigLoaderData;
    configURL: string;

    constructor(app: IApplication) {
        super(...args);
        this._state = {
            flag: ''
        };

        // use defaults for now
        this._data = this.getDefaults();

        this.configURL = utils.getRootUrl() + '?wp_spa_config=' + Date.now();
    }

    getMainSelector(): string {
        return '.spa-content__page';
    }

    getDefaults(): IConfigLoaderData {
        return {
            loadingScreenType: 'Icon',
            animationInName: 'pageIn',
            animationOutName: 'pageOut',
            animationInDuration: 400,
            animationOutDuration: 400,
            reusePages: 0,
            useCache: 1,
            useScreenClip: 0,
            showLoadingScreen: 1,
            asyncAnimation: 0,
            captureAll: 1
        };
    }

    _checkAnimationResource(callback: ConfigLoaderCallback) {
        var self = this;
        $.ajax({
            method: 'GET',
            url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.css",
            complete: function (response) {
                self._state.flag = response.status >= 200 && response.status < 400 ? 'normal' : 'default-only';
                if (callback) callback.call(self);
            }
        })
    }

    /**
     *
     * @param {Function} [callback]
     * @param {Object} [options]
     * @param {Boolean} [options.forceUpdate]
     */
    fetchConfig(callback: ConfigLoaderCallback, options: { forceUpdate: boolean }) {
        var self = this,
            opts = utils.defaults(options, {});

        if (opts.forceUpdate) this._state.flag = 'update-only';
        if(!this._state.flag) return this._checkAnimationResource(function(){self.fetchConfig(callback, options)});

        switch (this._state.flag) {
            case 'loaded':
                if (callback) callback(null, this._data);
                break;
            case 'default-only':
                self._data = this.getDefaults();
                if (callback) callback(null, this.getDefaults());
                break;
            case 'update-only':
            default:
                $.ajax({
                    url: this.configURL,
                    dataType: 'json',
                    json: true,
                    success: function success(response) {
                        self._data = $.extend(self._data, JSON.parse(response));
                        console.log('config response: %o', arguments);
                        if (!self._state.flag) self._state.flag = 'loaded';

                        // hotfix to check for valid config
                        if (self._data.animationInName) {
                            if (callback) callback(null, self._data);
                        } else {
                            if (callback) callback(null, self.getDefaults());
                        }
                    },
                    error: function failure(response) {
                        console.error('response: %o', response);
                        if (callback) callback(new Error("Could not fetch config"), response);
                    }
                });
        }
    }
}

utils.defaults(ConfigLoader.prototype, Module.prototype);

module.exports = ConfigLoader;
