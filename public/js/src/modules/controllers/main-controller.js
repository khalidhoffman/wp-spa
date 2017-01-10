var utils = require('utils'),

    Module = require('../lib/module'),
    ScriptRegister = require('../models/dom-node-register');

console.log("require('main-controller')");

/**
 * @extends Module
 * @class MainController
 * @constructor
 */
function MainController() {
    Module.apply(this, arguments);
    var $scope = this,
        self = this;

    console.log('mainController(%O)', arguments);
    this.config = this.configLoader.getDefaults();
    this.scriptRegister = new ScriptRegister();

    this.configLoader.fetchConfig(function (err, configData) {
        self.config = configData || self.config;
    });
    $scope.$on('$locationChangeSuccess', function (event, to, from) {
        if (to == from) return;
        utils.clearConsole();
        console.log('route: %o', arguments);
        console.log('mainController.$locationChangeSuccess() - routing to %o', to);
        $scope.contentLoader.getHTML(to, {
            useCache: self.config.useCache,
            reusePages: self.config.reusePages,
            done: function (err, $DOM) {
                if (err) {
                    console.warn(err);
                } else {
                    var data = {
                        $DOM: $DOM
                    };
                    console.log('mainController.$locationChangeSuccess() - update');
                    $scope.$broadcast("view:update", data);
                    $scope.$window.trigger('view:update', data);
                }
            }
        });
    });
}

MainController.prototype = {};

utils.defaults(MainController.prototype, Module.prototype);

module.exports = MainController;
