/**
 * @param {WPSPA} app
 * @class Module
 * @constructor
 */
export class Module implements IModule{
    app: IApplication;

    constructor(app) {
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

    $on(event, callback) {
        this.app.on.call(this.app, event, callback)
    }

    $broadcast() {
        this.app.emit.apply(this.app, arguments)
    }

    $apply(callback) {
        this.$timeout(callback)
    }
}

module.exports = Module;
