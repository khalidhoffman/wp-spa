define([
    'require',
    'router',
    'underscore',
    'sass',
    'text!modules/views.json',
    'jquery'
], function (require) {
    var $ = require('jquery'),
        utils = require('utils'),
        SassCompiler = require('sass'),
        Router = require('router'),
        _ = require('underscore'),
        resourceLoadCallbacks = [];

    SassCompiler.setWorkerUrl('/v7/src/vendors/sass.worker.js');
    var sass = new SassCompiler();
    sass.options({
        // Format output: nested, expanded, compact, compressed
        style: SassCompiler.style.compressed
    });

    requirejs.onResourceLoad = function (context, map, depArray) {
        if (requirejs.prototype.onResourceLoad) requirejs.prototype.onResourceLoad.apply(this, arguments);
        var callbackIndex = resourceLoadCallbacks.length;
        while (callbackIndex--) {
            var callbackMeta = resourceLoadCallbacks[callbackIndex];
            callbackMeta.context = _.extend({}, callbackMeta.context, {
                stop: (function (index) {
                    return function () {
                        resourceLoadCallbacks.splice(index, 1);
                    }
                })(callbackIndex)
            });
            console.log('onResourceLoad - executing callback w/ context: ', callbackMeta.context);
            callbackMeta.runnable.apply(callbackMeta.context, [context, map, depArray]);
        }
    };

    return {

        /**
         * Returns a path different from current page
         * @returns {string}
         */
        getNewTestPagePath: function () {
            var path = '',
                $body = $('body'),
                pages = JSON.parse(require('text!modules/views.json'));

            while (path == '' || 'page-' + path == $body.attr('data-template') || path == 'home' || path == 'single') {
                var viewModuleName = pages[utils.getRand(0, pages.length - 1)],
                    templateIndex = viewModuleName.indexOf('pages/'),
                    templateName = viewModuleName.substr(templateIndex + 'pages/'.length),
                    slugIndex = templateName.indexOf('page-');
                path = templateName.substr((slugIndex > -1) ? slugIndex + 'page-'.length : 0);
            }

            return path;
        },
        /**
         *
         * @param {string} [path] URL path to navigate to
         * @param {Object} [options]
         * @param {Function} [options.callback] - callback to be executed on 'view:defined'
         * @param {Function} [options.onNavigate] - callback to be executed on 'view:defined'
         * @param {Object} [options.context]
         * @param {Object[]} [options.arguments] - An array of arguments to pass callback
         */
        navigate: function (path, options) {
            var $link = $('.menu-item:nth-child(' + utils.getRand(1, 3) + ') a'),
                legacySettings = {
                    onNavigate: (options && options.callback) ? options.callback : null
                },
                _options = _.extend({}, legacySettings, options);


            if ($link.length == 0) $link = $('.link-home');
            if (/^\/?$/.test(path)) path = '';
            console.log('tests.navigate(%s, %o) | passed: %o', path, _options, options);

            Router.once('view:defined', function () {
                if (_options.onNavigate) _options.onNavigate.apply(_options.context, _options.arguments);
            });

            if (path || path === '') {
                path = utils.getRootUrl() + path;
                Router.navigateTo(path);
                console.log('test-utils - Router.navigateTo(%s)', path);
            } else {
                console.log('test-utils.click(%o|%s)', $link, $link.attr('href'));
                $link.click();
            }

        },
        /**
         *
         * @param {String} str Sass String to compile
         * @param {Function} callback Executed when compilation complete
         * @param {Object} options
         * @param {Object} options.context
         */
        compileSass: function (str, callback, options) {
            var _options = {
                context: null
            };
            _.assign(_options, options);
            sass.compile(str, function (result) {
                if (callback) callback.apply(_options.context, [result.text || result])
            });
        },
        /**
         *
         * @param {function} func - a function passed parameters (context, map, depArray)
         * @param {object} options - {context}
         */
        onResourceLoad: function (func, options) {
            var callbackMeta = {
                runnable: func,
                context: null
            };
            _.extend(callbackMeta, options);
            resourceLoadCallbacks.push(callbackMeta)
        },
        $: $
    }
});