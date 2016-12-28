var $ = require('jquery');

$.fn.fillSelectOptions = function (options) {
  console.log('fillKeyframes() called @ %o', this);
  var $selected = this;

  $selected.each(function (index, el) {
    var $el = $(el),
      defaultVal = $el.data('default');

    $el.prop('disabled', false);
    $el.html(options.map(function (option) {
      return "<option value='" + option + "'>" + option + "</option>"
    }));

    if (defaultVal) $el.val(defaultVal);
  })
};