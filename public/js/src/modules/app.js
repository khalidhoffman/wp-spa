var Router = require('modules/lib/router'),
    ResourceMonitor = require('modules/services/resource-monitor'),
    ConfigLoader = require('modules/services/config-loader'),
    ContentLoader = require('modules/services/content-loader'),
    Controllers = require('modules/controllers'),
    Views = require('modules/views');

/**
 * @class Application
 * @constructor
 */
function Application() {
    var self = this;

    this.bootstrap( $('.spa-content'));
    this.$window = $(window);
    this.meta = {
        baseHREF: $('head base').attr('href')
    };

    this.$timeout = function (callback, wait) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(callback)
        } else {
            callback();
        }
    };

    this.resourceMonitor = new ResourceMonitor();
    this.configLoader = new ConfigLoader(this);
    this.contentLoader = new ContentLoader(this);

    this.router = new Router(this.meta.baseHREF);

    this.router.on(/.*/, function (path) {
        self.emit.call(self, '$locationChangeSuccess', path, self.previousPath);
        self.previousPath = path;
    });

    this.mainController = new Controllers.Main(this);
    this.uiController = new Controllers.UI(this);
    this.htmlView = new Views.Html(this);
    this.headView = new Views.Head(this);
}

Application.prototype = {
    events: {},
    extendModule: function (module) {
        var extendedProps = [
            '$timeout',
            '$window',
            '$root',
            'meta',
            'resourceMonitor',
            'configLoader',
            'contentLoader',
            'router'
        ],
            propsLength = extendedProps.length;
        for (var propIdx = 0; propIdx < propsLength; propIdx++) {
            module[extendedProps[propIdx]] = this[extendedProps[propIdx]];
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
    },

    bootstrap: function($root){

        this.$root = $root;
        this.$root
            .find('.spa-content__page')
            .css({'display': 'none'})
            .removeClass('spa-content--no-js');
    }
};

module.exports = Application;
