var utils = require('utils'),
    RegisterEntry = require('./register-entry');

/**
 *
 * @extends RegisterEntry
 * @class ScriptRegisterEntry
 * @param scriptDOMNode
 * @constructor
 */
function ScriptRegisterEntry(scriptDOMNode) {
    RegisterEntry.apply(this, arguments);
}

ScriptRegisterEntry.prototype = {

    getId: function(){
        return this.el.src || this.$el.html();
    }
};

utils.defaults(ScriptRegisterEntry.prototype, RegisterEntry.prototype);

module.exports = ScriptRegisterEntry;
