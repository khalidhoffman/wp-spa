var _ = require('lodash');

function Node($el){
    var node = {
        tagName : $el.prop("tagName").toLowerCase(),
        attrs : {}
    };

    _.forEach($el[0], function(attr){
        node.attrs[attr.name] = attr.value;
    });
    
    return node;
}

module.exports = {
    DOMNode : Node
}
