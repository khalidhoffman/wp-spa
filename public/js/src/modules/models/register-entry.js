var $ = require('jquery');

function RegisterEntry(scriptDOMNode) {
    this.meta = {};
    this.el = scriptDOMNode;
    this.$el = $(this.el);
}

module.exports = RegisterEntry;
