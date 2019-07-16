import { Application } from 'modules/app';

var utils = require('modules/lib/utils');

import { Module } from '../lib/module';
import { NodeRegister } from 'modules/models/dom-node-register';

console.log('require(\'main-controller\')');

/**
 * @extends Module
 * @class MainController
 * @constructor
 */
export class MainController extends Module {
  config: IConfigLoaderData;
  scriptRegister: NodeRegister = new NodeRegister();

  constructor(public app: Application) {
    super(app);

    this.config = this.configLoader.getDefaults();
    this.init();
  }

  async init(): Promise<void> {
    await this.configLoader.fetchConfig((err, configData) => {
      this.config = configData || this.config;

      this.$on('$locationChangeSuccess', (event, to, from) => {
        console.log('route: %o', event, to, from);

        if (to == from) {
          return;
        }

        console.log('mainController.$locationChangeSuccess() - routing to %o', to);

        this.contentLoader.getHTML(to, {
          useCache: this.config.useCache,
          reusePages: this.config.reusePages,
          done: (err, $DOM) => {
            if (err) {
              console.warn(err);
              return;
            }

            const data = { $DOM };

            console.log('mainController.$locationChangeSuccess() - update');

            this.$broadcast('view:update', data);
            this.$window.trigger('view:update', data);
          }
        });
      });
    });
  }
}

module.exports = MainController;
