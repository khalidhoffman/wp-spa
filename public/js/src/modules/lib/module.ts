import { Application }     from 'modules/app';
import { ConfigLoader }    from 'modules/services/config-loader';
import { ContentLoader }   from 'modules/services/content-loader';
import { AppRouter }       from 'modules/lib/router';
import { ResourceMonitor } from 'modules/services/resource-monitor';

export class Module {
  meta: IModuleMeta;
  $window: JQuery<IModuleElement>;
  $root: JQuery<IModuleElement>;
  resourceMonitor: ResourceMonitor;
  configLoader: ConfigLoader;
  contentLoader: ContentLoader;
  router: AppRouter;

  previousPath: string;
  $timeout;

  constructor(public app: Application) {
    this.app = app;
    this.app.extendModule(this);
  }

  $on(event, callback) {
    this.app.on.call(this.app, event, callback)
  }

  $broadcast(event: string, ...data: any[]) {
    this.app.emit.apply(this.app, arguments)
  }
}
