var $ = require('jquery');


$.fn.prependedCSS = function(op){
    if (op.constructor === Array){
        var css  = '';
        op.forEach(function(cssStyle){
            css += cssStyle.selector + "{";
            for (var propName in cssStyle.styles){
                if (cssStyle.styles.hasOwnProperty(propName)){
                    css += propName + ':' + cssStyle.styles[propName] + ';';
                }
            }
            css += "}";
        });
        var styles = "<style>" + css + "</style>";
        this.$styles = $(styles);
        this.prepend(this.$styles);
    } else {
        switch(op) {
            case 'remove':
                if (this.$styles) this.$styles.remove();
                break;
            default:
                break;
        }

    }
};

module.exports = $;