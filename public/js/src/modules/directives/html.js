var _ = require('lodash'),
    $ = require('jquery'),

    Module = require('../lib/module'),
    DOMNodeRegister = require('../models/dom-node-register'),
    ScriptRegisterEntry = require('../models/script-register-entry'),
    StyleRegisterEntry = require('../models/style-register-entry');

/**
 * @extends Module
 * @class HTMLDirective
 * @constructor
 */
function HTMLDirective() {
    Module.apply(this, arguments);
    var $scope = this,
        $element = $('html');

    this.$element = $element;
    $scope.$root = $element.find('.spa-content');
    $scope.selectors = {
        script: 'script',
        style: "link[rel='stylesheet'], style",
        spaScript: '[src*="wp-spa-public"]'
    };

    $scope.scriptRegister = new DOMNodeRegister();
    $scope.styleRegister = new DOMNodeRegister();

    $scope.registerScripts($element.find('script'));
    $scope.registerStyles($element.find($scope.selectors.style));

    $scope.formatDOM($element, {ignore: $scope.selectors.spaScript});

    $scope.$on('view:update', function (event, data) {
        var $DOM = data.$DOM;

        $scope.formatDOM($DOM, {remove: $scope.selectors.spaScript});

        var $styles = $DOM.find($scope.selectors.style),
            $scripts = $DOM.find($scope.selectors.script);

        $scripts.each(function (index, el) {
            var scriptRegEntry = new ScriptRegisterEntry(el);
            if ($scope.scriptRegister.contains(scriptRegEntry)) {
                scriptRegEntry.$el.attr('data-spa-loaded', true);
                console.log('ng.html - excluding %o', el)
            } else {
                $scope.scriptRegister.add(scriptRegEntry);
                console.warn('ng.html - adding %o', el)
            }
        });

        $styles.each(function (index, el) {
            var styleRegEntry = new StyleRegisterEntry(el);
            if ($scope.styleRegister.contains(styleRegEntry)) {
                styleRegEntry.$el.attr('data-spa-loaded', true);
                console.log('ng.html - excluding %o', el)
            } else {
                $scope.styleRegister.add(styleRegEntry);
                console.warn('ng.html - adding %o', el)
            }
        });

        var eventData = _.defaults({
            $scripts: $scripts,
            $styles: $styles,
            $root: $scope.$root,
            old: {
                $scripts: $scripts.not("[data-spa-loaded='true']"),
                $styles: $styles.not("[data-spa-loaded='true']")
            },
            new: {
                $scripts: $scripts.filter("[data-spa-loaded='true']"),
                $styles: $styles.filter("[data-spa-loaded='true']")
            }
        }, data);
        $scope.$broadcast('html:update', eventData)
    });
}

HTMLDirective.prototype = {

    registerScripts: function ($scripts) {
        var $scope = this;
        $scripts.each(function (index, el) {
            $scope.scriptRegister.add(new ScriptRegisterEntry(el));
            console.warn('ng.html - adding %o', el)
        })
    },

    registerStyles: function ($styles) {
        var $scope = this;
        $styles.each(function (index, el) {
            $scope.styleRegister.add(new StyleRegisterEntry(el));
            console.warn('ng.html - adding %o', el)
        })
    },

    /**
     *
     * @param $DOM
     * @param [options]
     * @param {String} [options.ignore]
     * @param {String} [options.remove]
     */
    formatDOM: function ($DOM, options) {
        var $scope = this,
            _options = _.defaults({}, options),
            $scripts = $DOM.find('script');

        if (_options.ignore) {
            $scripts = $scripts.not(_options.ignore);
        }
        if (_options.remove) {
            var $removedScripts = $scripts.filter(_options.remove).remove();
            $scripts = $scripts.not($removedScripts);
        }
        $scripts.detach();
        $DOM.find($scope.configLoader.getMainSelector()).append($scripts);
    }

};

_.defaults(HTMLDirective.prototype, Module.prototype);
module.exports = HTMLDirective;
