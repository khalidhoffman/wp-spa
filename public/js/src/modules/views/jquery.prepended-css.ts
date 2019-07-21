import $ from 'jquery';

$.fn.prependedCSS = function (op: IPrependCSSArgs): void {
    if (Array.isArray(op)){
        let css  = '';

        op.forEach(function(cssStyle){
            css += cssStyle.selector + "{";
            for (let propName in cssStyle.styles){
                if (cssStyle.styles.hasOwnProperty(propName)){
                    css += propName + ':' + cssStyle.styles[propName] + ';';
                }
            }
            css += "}";
        });

        this.$styles = $("<style>" + css + "</style>");
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