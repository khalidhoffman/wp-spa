import { Application }     from 'modules/app';
import { AppRouter }       from 'modules/lib/router';
import { ConfigLoader }    from 'modules/services/config-loader';
import { ContentLoader }   from 'modules/services/content-loader';
import { ResourceMonitor } from 'modules/services/resource-monitor';

const defaultExtendedProps = [
  '$timeout',
  '$window',
  '$root',
  'meta',
  'resourceMonitor',
  'configLoader',
  'contentLoader',
  'router'
];

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

    for (let propertyName of defaultExtendedProps) {
      this[propertyName] = this.app[propertyName];
    }
  }

  $on(event, callback) {
    this.app.on(event, callback)
  }

  $broadcast(event: string, ...data: any[]) {
    this.app.emit(event, ...data)
  }
}
