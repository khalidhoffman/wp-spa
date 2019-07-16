import $ from 'jquery';

import { Application } from 'modules/app';
import { Module }      from '../lib/module';
import * as utils      from 'modules/lib/utils';

export type ConfigLoaderCallback = (error: Error | null, self: ConfigLoader, data?: IConfigLoaderData) => any;

export class ConfigLoader extends Module {
  private _state: IConfigLoaderState;
  private _data: IConfigLoaderData;
  configURL: string;

  constructor(app: Application) {
    super(app);
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

  private async _checkAnimationResource(callback: ConfigLoaderCallback) {
    await $.ajax({
      method: 'GET',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.css',
      complete: (response) => {
        this._state.flag = response.status >= 200 && response.status < 400 ? 'normal' : 'default-only';
        if (callback) {
          callback.call(this);
        }
      }
    })
  }

  /**
   *
   * @param {Function} [callback]
   * @param {Object} [options]
   * @param {Boolean} [options.forceUpdate]
   */
  async fetchConfig(callback: ConfigLoaderCallback, options?: { forceUpdate?: boolean }): Promise<void> {
    const opts = utils.defaults(options, {});

    if (opts.forceUpdate) this._state.flag = 'update-only';
    if (!this._state.flag) {
      return this._checkAnimationResource(async () => {
        await this.fetchConfig(callback, options)
      });
    }

    switch (this._state.flag) {
      case 'loaded':
        if (callback) callback(null, this._data);
        break;
      case 'default-only':
        this._data = this.getDefaults();
        if (callback) callback(null, this.getDefaults());
        break;
      case 'update-only':
      default:
        await $.ajax({
          url: this.configURL,
          dataType: 'json',
          success: (response) => {
            this._data = $.extend(this._data, JSON.parse(response));

            if (!this._state.flag) {
              this._state.flag = 'loaded';
            }

            // hotfix to check for valid config
            if (callback) {
              const callbackData = this._data.animationInName ? this._data : this.getDefaults()
              callback(null, this, callbackData);
            }
          },
          error: (response) => {
            console.error('response: %o', response);

            if (callback) {
              callback(new Error('Could not fetch config'), this);
            }
          }
        });
    }
  }
}

