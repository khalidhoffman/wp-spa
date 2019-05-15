var url = require('url');


class Router implements IRouter  {
    base: string;
    history: IRouterHistory;
    routes: IRouterHandler[];

    constructor(base: string) {
        this.history = require('history');
        this.base = base;
        this.routes = [];
        this.history.Adapter.bind(window, 'statechange', () => {
            var state = this.history.getState(),
                path = state.data.path,
                routeHandlerIdx = 0,
                routeHandler = this.routes[routeHandlerIdx];
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

module.exports = Router;