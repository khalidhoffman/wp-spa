/**
 * @param {WPSPA} app
 * @class Module
 * @constructor
 */
function Module(app) {
    this.app = app;
    this.app.extendModule(this);

    /**
     * @var {directer.Router} router
     * @var {jQuery} $window
     * @var {Function} $timeout
     * @var {ConfigLoader} $configLoader
     * @var {ContentLoader} $contentLoader
     */
}

Module.prototype = {
    $on: function (event, callback) {
        this.app.on.call(this.app, event, callback)
    },
    $broadcast: function () {
        this.app.emit.apply(this.app, arguments)
    },
    $apply: function(callback){
        callback()
    }
};

module.exports = Module;