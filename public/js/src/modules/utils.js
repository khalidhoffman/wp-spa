define([
        'require',
        'state',
        'jquery'
    ],
    function (require) {

        var $ = require('jquery'),
            DOMParser = DOMParser || function () {
                    return {
                        parseFromString: function (DOMString) {
                            return $(DOMString);
                        }
                    }
                },
            pre = 'webkit',
            spaState = require('state');
            domParser = new DOMParser();


        if (window.getComputedStyle) {
            // TODO simplify code
            var styles = window.getComputedStyle(document.documentElement, '');
            try {
                pre = (Array.prototype.slice
                        .call(styles)
                        .join('')
                        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
                )[1];
            } catch (e) {
                console.error("Couldn't determine browser prefix: ", e);
            }
        }
        var utils = {
            browserPrefix: pre,
            setPrefixedStyle: function (el, cssProperty, cssValue) {
                if (pre == "") {
                    el.style[cssProperty] = cssValue;
                } else {
                    el.style[pre + cssProperty] = cssValue;
                }
            },
            reverseArray: function reverse(a) {
                var temp = [],
                    len = a.length;
                while (len--) {
                    temp.push(a[len]);
                }
                return temp;
            },
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
             * @param func
             * @param options
             * @returns {function}
             */
            debounce: function (func, options) {
                var timeout,
                    defaults = {
                        delay: 600,
                        context: null,
                        args: null
                    };
                options = $.extend(defaults, options);

                function done() {
                    func.apply(options.context, options.args);
                }

                function debounced() {
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(done, (options.delay));
                }

                return debounced;
            },
            /**
             *
             * @param {function} callback
             * @param {object} options
             * @param {object} options.context
             * @param {Array} options.args
             * @param {Boolean} options.isNumber
             * @returns {string}
             */
            testPerformance: function (callback, options) {
                if ((!performance) || (!performance.now)) return 'n/a';
                var defaults = {
                        context: window,
                        args: null
                    },
                    t0 = 0,
                    t1 = 0;
                options = $.extend(defaults, options);

                t0 = performance.now();
                callback.apply(options.context, options.args);
                t1 = performance.now();
                return (options.isNumber) ? (t1 - t0) : ('time: ' + (t1 - t0));
            },
            /**
             *
             * @param $el {jQuery}
             * @param options {object} - {duration, callback, context}
             */
            scrollTo: function ($el, options) {
                var animateOptions = {
                    duration: (options) ? ((options.duration) ? options.duration : options) : 600
                }, callbackCount = 1;
                if (options && options.callback) {
                    animateOptions['complete'] = function () {
                        if (callbackCount--) options.callback.apply(options.context, options.arguments);
                    }
                }
                $('html, body').animate({
                    scrollTop: ($el.offset().top - $('header').height() + 2) // +2 for good measure
                }, animateOptions);
            },
            /**
             *
             * @param html
             * @param options
             * @returns {*|jQuery|HTMLElement}
             */
            parseDOMString: function (html, options) {
                var defaults = {
                    safemode: true
                };
                options = $.extend(defaults, options);
                if (options.safemode) {
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
            /**
             *
             * @param $el
             */
            jumpTo: function ($el) {
                var scrollTop = ($el.offset().top - $('header').height() + 2);
                $('html, body').scrollTop((scrollTop < 0) ? 0 : scrollTop); // +2 for good measure
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
                return spaState.get('siteURLMeta').pathname;
            },
            /**
             *
             * @param {Object} [options]
             * @param {Boolean} [options.trailingSlash = true]
             * @returns {string} - site's root url
             */
            getRootUrl: function (options) {
                return spaState.get('siteURL') + ((options && options.trailingSlash === false) ? '' : '/');
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
            /**
             *
             * @param {jQuery|HTMLElement} $el jQuery or HTMLElement to be fixed
             * @param {object} options
             * @param {number} options.height height of the viewport for the fixed HTMLElement
             */
            makeFixed: function ($el, options) {
                var _$el = ($el.jQuery) ? $el : $($el),
                    _$parent = _$el.parent(),
                    _options = {
                        height: $el.height()
                    };
                $.extend(_options, options);
                _$parent.addClass('fixed-view-parent').css({
                    height: _options.height
                });
                _$parent.siblings(':not(.fixed-view)').addClass('fixed-view-sibling');
                _$el.addClass('fixed-view').css({
                    height: _options.height
                });
            },
            clearConsole: function(){
                if (typeof console._commandLineAPI !== 'undefined') {
                    console.API = console._commandLineAPI; //chrome
                } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
                    console.API = console._inspectorCommandLineAPI; //Safari
                } else if (typeof console.clear !== 'undefined') {
                    console.API = console;
                }

                console.API.clear();
            }
        };

        return utils;
    });