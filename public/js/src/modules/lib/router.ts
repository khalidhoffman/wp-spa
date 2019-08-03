import * as url from 'url';
import * as qs  from 'querystring';

import { AppHistory } from 'modules/lib/history';
import Application    from 'modules/app';
import { Module }     from 'modules/lib/module';


interface IAppRoute {
  path: string | '@';
  query: string | '@';
  hash: string | '@';
}

export class AppRoute implements IAppRoute {
  path: string;
  query: string;
  hash: string;

  constructor(data: Partial<AppRoute> = {}) {
    Object.assign(this, data);
  }
}

export class AppRouter extends Module implements IRouter {
  history: AppHistory = new AppHistory();
  routes: IRouterHandler[] = [];

  constructor(app: Application, public base: string = '/') {
    super(app);

  }

  moduleInit() {
    this.history.onChange((evt) => {
      const state = this.history.getState();
      const path = state.path;

      console.log('statechange:', state, evt);

      for (let routeHandler of this.routes) {
        if (routeHandler.path.test(path)) {
          routeHandler.callback(path);
        }
      }
    });
  }

  on(path, callback) {
    this.routes.push({
      path: path,
      callback: callback
    })
  }

  path(path: string) {
    const pathUrl = url.resolve(this.base, path);
    const data = { path, url: pathUrl };

    this.history.pushState(data, undefined, pathUrl);
  }

  parseURL(href: string, options: { captureAll?: boolean } = {}): AppRoute {
    const route = new AppRoute();
    const locationHrefMeta = url.parse(location.href);
    const targetHrefMeta: url.Url = url.parse(href);
    const isPathnameChange = locationHrefMeta.pathname !== targetHrefMeta.pathname;
    const isQueryChange = locationHrefMeta.query !== targetHrefMeta.query;
    const isHashChange = locationHrefMeta.hash !== targetHrefMeta.hash;
    const isAdminRoute = /\/wp\-(admin|login)\/?/.test(targetHrefMeta.path);
    const isCurrentRoute = location.href.match(new RegExp(targetHrefMeta.pathname + '\/?$'));
    // animate for path changes. allow native hash otherwise
    const isCapturedRoute = options.captureAll
      || isPathnameChange
      || this.contentLoader.hasPageSync(href)
      || this.contentLoader.hasPostSync(href);


    route.hash = isHashChange ? targetHrefMeta.hash : '@';
    route.query = isQueryChange ? targetHrefMeta.search : '@';

    if (isAdminRoute) {
      return route;
    }

    if (isCapturedRoute) {
      route.path = targetHrefMeta.pathname;
    }

    if (isCurrentRoute) {
      route.path = '@';
    }

    return route;
  }

  parseQueryParams(routeQuery: string): qs.ParsedUrlQuery {
    return qs.parse(/^\?/.test(routeQuery) ? routeQuery : `?${routeQuery}`);
  }
}
