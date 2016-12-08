var _ = require('lodash'),

    RegisterEntry = require('./script-register-entry');

function ScriptRegister() {
    this.registry = [];
}

ScriptRegister.prototype = {

    /**
     *
     * @param {RegisterEntry} regEntry
     */
    contains: function (regEntry) {
        var result = false;
        _.forEach(this.registry, function (savedEntry) {
            if (savedEntry.getId() == regEntry.getId()) {
                result = true;
                return false;
            }
        });
        return result;
    },

    /**
     *
     * @param {RegisterEntry} regEntry
     */
    add: function (regEntry) {
        if (!this.contains(regEntry)) {
            this.registry.push(regEntry);
        }
    }
};

module.exports = ScriptRegister;
