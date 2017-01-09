var Router = require('./lib/router'),
    ConfigLoader = require('modules/services/config-loader'),
    ContentLoader = require('modules/services/content-loader');

/**
 * @class Application
 * @constructor
 */
function Application() {
    var self = this;

    this.$timeout = function (callback, wait) {
        setTimeout(callback, wait || 1);
    };
    this.$window = $('window');
    this.meta = {
        baseHREF : $('head base').attr('href')
    };
    this.configLoader = new ConfigLoader(this);
    this.contentLoader = new ContentLoader(this);

    this.router = new Router(this.meta.baseHREF);
    this.router.on(/.*/, function (path) {
        self.emit.call(self, '$locationChangeSuccess', path, self.previousPath);
        self.previousPath = path;
    });
    /*
     this.router.configure({
     html5history: true,
     on: function () {
     self.emit.apply(self, ['$locationChangeSuccess'].concat(arguments));
     }
     });
     this.router.init();
     */
}

Application.prototype = {
    events: {},
    extendModule: function (module) {
        var extendedProps = [
            '$timeout',
            '$window',
            'meta',
            'configLoader',
            'contentLoader',
            'router'
        ];
        for (var propIdx in extendedProps) {
            if (extendedProps.hasOwnProperty(propIdx)) {
                module[extendedProps[propIdx]] = this[extendedProps[propIdx]]
            }
        }
    },
    on: function (event, callback) {
        this.events[event] = this.events[event] || [];
        this.events[event].push({
            callback: callback,
            context: this
        });
    },
    emit: function (event) {
        var listeners = this.events[event] || [],
            listenerIdx = 0,
            listener = listeners[listenerIdx];

        while (listener) {
            listener.callback.apply(listener.context, arguments);
            listenerIdx++;
            listener = listeners[listenerIdx];
        }
    }
};

module.exports = Application;