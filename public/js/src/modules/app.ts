import { AppRouter }       from 'modules/lib/router';
import { ResourceMonitor } from 'modules/services/resource-monitor';
import { ConfigLoader }    from 'modules/services/config-loader';
import { ContentLoader }   from 'modules/services/content-loader';
import * as Controllers    from 'modules/controllers';
import * as Views          from 'modules/views';
import { Module }          from 'modules/lib';

export class Application implements IApplication {
  events = {};
  $root: JQuery;
  $window: JQuery<Window>;
  meta: IApplicationMeta;
  configLoader: ConfigLoader;
  contentLoader: ContentLoader;
  resourceMonitor: ResourceMonitor;
  router: AppRouter;
  previousPath: string;

  uiController: Controllers.UIController;
  mainController: Controllers.MainController;
  htmlView: Views.HTMLDirective;
  headView: Views.HeadDirective;

  constructor(private bootstrapSelector: string = '.spa-content') {

    this.bootstrap($(this.bootstrapSelector));
    this.$window = $(window);
    this.meta = {
      baseHREF: $('head base').attr('href')
    };

    this.resourceMonitor = new ResourceMonitor();
    this.configLoader = new ConfigLoader(this);
    this.contentLoader = new ContentLoader(this);
    this.router = new AppRouter(this, this.meta.baseHREF);

    this.router.on(/.*/, (path) => {
      this.emit('$locationChangeSuccess', path, this.previousPath);
      this.previousPath = path;
    });

    this.mainController = new Controllers.MainController(this);
    this.uiController = new Controllers.UIController(this);
    this.htmlView = new Views.HTMLDirective(this);
    this.headView = new Views.HeadDirective(this);

    this.init();
  }

  get modules(): Module[] {
    return Object.keys(this).map(key => this[key]).filter(item => item instanceof Module);
  }

  init() {
    this.modules.forEach(module => module.moduleInit && module.moduleInit())
  }

  $timeout(callback: Function, wait?: number) {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(callback as FrameRequestCallback)
    } else {
      callback();
    }
  }

  on(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push({
      callback: callback,
      context: this
    });
  }

  emit(event: string, ...args) {
    const listeners = this.events[event] || [];
    let listenerIdx = 0;
    let listener = listeners[listenerIdx];

    while (listener) {
      listener.callback.apply(listener.context, arguments);
      listenerIdx++;
      listener = listeners[listenerIdx];
    }
  }

  bootstrap($root: JQuery) {
    const $contentPage = $root.find('.spa-content__page');

    this.$root = $root;
    $contentPage.css({ 'display': 'none' });
    $contentPage.removeClass('spa-content--no-js');
  }
}

export default Application;
