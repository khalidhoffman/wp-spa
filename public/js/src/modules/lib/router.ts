import * as url from 'url';

import { AppHistory } from 'modules/lib/history';


export class AppRouter implements IRouter {
  history: AppHistory = new AppHistory();
  routes: IRouterHandler[] = [];

  constructor(public base: string = '/') {
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
}
