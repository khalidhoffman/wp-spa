var $ = require('jquery'),
    CSSParser = require('css-parser');

function SettingsController(options) {
    var self = this;

    this.options = options;
    this.keyframes = [];

    $.ajax({
        url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.css",
        complete: function (response) {
            console.log("response:%o", arguments);
            if (response.status == 200) {
                var cssParser = new CSSParser(),
                    cssAST = cssParser.parse(response.responseText, false, false);

                var cssRule,
                    cssRuleIdx = 0;

                while(cssRule = cssAST.cssRules[cssRuleIdx++]){
                    if (cssRule.type == 7) {
                        self.keyframes.push(cssRule.name);
                    }
                }

                if (self.options.onKeyframesLoaded) self.options.onKeyframesLoaded();
                console.log('cssAST: %o', self.keyframes);
            } else {
                // handle failure
            }
        }
    });
}

SettingsController.prototype = {
    getKeyFrames: function () {
        return this.keyframes;
    }
};

module.exports = SettingsController;
