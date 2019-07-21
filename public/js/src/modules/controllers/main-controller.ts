import { Application } from 'modules/app';

import { Module }          from '../lib/module';
import { DOMNodeRegister } from 'modules/models/dom-node-register';


export class MainController extends Module {
  config: IConfigLoaderData;
  scriptRegister: DOMNodeRegister = new DOMNodeRegister();

  constructor(public app: Application) {
    super(app);

    this.config = this.configLoader.getDefaults();
    this.init();
  }

  async init(): Promise<void> {

    await this.configLoader.fetchConfig((err, configData) => {
      this.config = configData || this.config;

      this.$on('$locationChangeSuccess', async (event, to, from) => {
        console.log('route: %o', event, to, from);

        if (to === from) {
          return;
        }

        console.log('mainController.$locationChangeSuccess() - routing to %o', to);

        await this.contentLoader.getHTML(to, {
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
