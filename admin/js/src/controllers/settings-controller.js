var $ = require('jquery'),
  _ = require('lodash'),
  CSSParser = require('css-parser');

function SettingsController(options) {
  var opts = _.defaults(options, {}),
    self = this;

  this.options = opts;
  this.keyframes = [];

  $.ajax({
    url: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.css",
    complete: function (response) {
      console.log("response:%o", arguments);
      if (response.status == 200) {
        var cssParser = new CSSParser(),
          cssAST = cssParser.parse(response.responseText, false, false);

        self.keyframes = _.reduce(cssAST.cssRules, function (collection, cssRule) {
          if (cssRule.type == 7) {
            collection.push(cssRule.name);
          }
          return collection;
        }, []);

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
;
