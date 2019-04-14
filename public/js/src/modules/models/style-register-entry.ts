var utils = require('utils'),
    RegisterEntry = require('./register-entry');

/**
 *
 * @extends RegisterEntry
 * @class StyleRegisterEntry
 * @param styleDOMNode
 * @constructor
 */
function StyleRegisterEntry(styleDOMNode) {
    RegisterEntry.apply(this, arguments);
}

StyleRegisterEntry.prototype = {

    getId: function(){
        return this.$el.attr('href') || this.$el.html();
    }
};

utils.defaults(StyleRegisterEntry.prototype, RegisterEntry.prototype);

module.exports = StyleRegisterEntry;
