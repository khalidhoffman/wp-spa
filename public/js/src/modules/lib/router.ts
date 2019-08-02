import * as url from 'url';

import { AppHistory } from 'modules/lib/history';


export class AppRouter implements IRouter {
  history: AppHistory = new AppHistory();
  routes: IRouterHandler[] = [];

  constructor(public base: string = '/') {
    this.history.onChange(() => {
      const state = this.history.getState();
      const path = state.data.path;

      console.log('statechange:', state);

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

  path(path) {
    this.history.pushState({ path, url: url.resolve(this.base, path) }, path);
  }
}
