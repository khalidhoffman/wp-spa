import * as url from 'url';


export class AppRouter implements IRouter  {
    base: string;
    history: IRouterHistory;
    routes: IRouterHandler[];

    constructor(base: string) {
        this.history = require('history');
        this.base = base;
        this.routes = [];
        this.history.Adapter.bind(window, 'statechange', () => {
            const state = this.history.getState();
            const path = state.data.path;
            let routeHandlerIdx = 0;
            let routeHandler = this.routes[routeHandlerIdx];

            console.log('statechange:', state);
            while (routeHandler) {
                if (routeHandler.path.test(path)) {
                    routeHandler.callback(path);
                }
                routeHandlerIdx++;
                routeHandler = this.routes[routeHandlerIdx];
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
        this.history.pushState({path: path}, null, url.resolve(this.base, path));
    }
}
