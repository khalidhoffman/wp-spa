var url = require('url'),

    $ = require('jquery'),

    DOMParser = DOMParser || function () {
            return {
                parseFromString: function (DOMString) {
                    return $(DOMString);
                }
            }
        },
    siteURL = $('head base').attr('href'),
    siteURLMeta = url.parse(siteURL),
    domParser = new DOMParser();

var utils = {
    createCookie: function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    readCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: function (name) {
        var value = '',
            days = -1;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    },
    /**
     *
     * @param $target {jQuery|Number}
     * @param options {object} - {duration, callback, context}
     */
    scrollTo: function ($target, options) {
        var animateOptions = {
                duration: (options) ? ((options.duration) ? options.duration : options) : 600
            }, callbackCount = 1,
            scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
        if (options && options.callback) {
            animateOptions['complete'] = function () {
                if (callbackCount--) options.callback.apply(options.context, options.arguments);
            }
        }
        $('html, body').animate({
            scrollTop: scrollTop// +2 for good measure
        }, animateOptions);
    },
    /**
     *
     * @param $target
     */
    jumpTo: function ($target) {
        var scrollTop = $target.offset ? ($target.offset().top - $('header').height() + 2) : $target;
        $('html, body').scrollTop((scrollTop < 0) ? 0 : scrollTop); // +2 for good measure
    },
    /**
     *
     * @param html
     * @param options
     * @returns {*|jQuery|HTMLElement}
     */
    parseDOMString: function (html, options) {
        var opts = utils.defaults({
            safemode: true
        }, options);
        if (opts.safemode) {
            try {
                var DOM = domParser.parseFromString(html, 'text/html');
                return $(DOM);
            } catch (e) {
                console.error(e);
                return $(html);
            }
        } else {
            return $(domParser.parseFromString(html, 'text/html'));
        }
    },
    getCurrentPath: function () {
        return location.pathname.substr(utils.getRootPath({trailingSlash: false}).length);
    },
    /**
     * Returns the root path
     * @param {Object} [options]
     * @param {Boolean} [options.trailingSlash = true]
     * @returns {String}
     */
    getRootPath: function (options) {
        return siteURLMeta.pathname + ((options && options.trailingSlash === false) ? '' : '/');
    },

    getRootUrl: function () {
        return siteURL;
    },
    /**
     *
     * @param {String} requestURL
     * @returns {string}
     */
    getPathFromUrl: function (requestURL) {
        var domainUrl = utils.getRootUrl({trailingSlash: false}),
            pathStartIndex = requestURL.indexOf(domainUrl) + domainUrl.length;
        return requestURL.substr(pathStartIndex);
    },
    /**
     * Sanitizes a path/url aka adds trailing slash if need be to any path
     * @param {string} requestURL
     * @returns {string}
     */
    sanitizeUrl: function (requestURL) {
        return (requestURL.match('/\/$/')) ? requestURL : requestURL + '/';
    },
    /**
     *
     * @param {string} requestURL
     * @returns {*|jQuery|HTMLElement}
     */
    loadCss: function (requestURL) {
        var $link = $(document.createElement('link'));
        $link.attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: requestURL
        });
        $link.appendTo('head');
        return $link;
    },
    /**
     *
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    getRand: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    clearConsole: function () {
        if (typeof console._commandLineAPI !== 'undefined') {
            console.API = console._commandLineAPI; //chrome
        } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
            console.API = console._inspectorCommandLineAPI; //Safari
        } else if (typeof console.clear !== 'undefined') {
            console.API = console;
        }

        // console.API.clear();
    },
    defaults: function(){
        var idx = 0,
            base = arguments[idx++] || {},
            next,
            key;
        while (next = arguments[idx++]){
            for (key in next){
                if(next.hasOwnProperty(key) && base[key] == undefined){
                    base[key] = next[key]
                }
            }
        }
        return base;
    }
};

module.exports = utils;