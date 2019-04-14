var url = require('url');

function Router(base) {
    var self = this;

    this.history = require('history');
    this.base = base;
    this.routes = [];
    this.history.Adapter.bind(window, 'statechange', function () {
        var state = self.history.getState(),
            path = state.data.path,
            routeHandlerIdx = 0,
            routeHandler = self.routes[routeHandlerIdx];
        console.log('statechange:', state);
        while (routeHandler) {
            if (routeHandler.path.test(path)) {
                routeHandler.callback(path);
            }
            routeHandlerIdx++;
            routeHandler = self.routes[routeHandlerIdx];
        }
    });
}

Router.prototype = {
    on: function (path, callback) {
        this.routes.push({
            path: path,
            callback: callback
        })
    },
    path: function (path) {
        this.history.pushState({path: path}, null, url.resolve(this.base, path));
    }
};

module.exports = Router;