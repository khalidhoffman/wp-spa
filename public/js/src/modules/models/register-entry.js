var $ = require('jquery');

/**
 * @class RegisterEntry
 * @param scriptDOMNode
 * @constructor
 */
function RegisterEntry(scriptDOMNode) {
    this.meta = {};
    this.el = scriptDOMNode;
    this.$el = $(this.el);
}

module.exports = RegisterEntry;
