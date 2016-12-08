var $ = require('jquery'),

    RegisterEntry = require('./register-entry');

function StyleRegisterEntry(styleDOMNode) {
    RegisterEntry.apply(this, arguments);
}

StyleRegisterEntry.prototype = {

    getId: function(){
        return this.$el.attr('href') || this.$el.html();
    }
};

_.defaults(StyleRegisterEntry.prototype, RegisterEntry.prototype);

module.exports = StyleRegisterEntry;