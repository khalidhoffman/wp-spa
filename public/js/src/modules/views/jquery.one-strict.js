var $ = require('jquery');

$.fn.oneTimeout = function (event, callback, duration) {
    var $el = this,
        isCallbackClean = true,
        timeoutId,
        strictCallback = function () {
            clearTimeout(timeoutId);
            if (isCallbackClean) callback();
        };

    this.one(event, strictCallback);

    timeoutId = setTimeout(function () {
        isCallbackClean = false;
        $el.off(event, null, strictCallback);
        callback();
    }, duration);
};

$.fn.oneDelayedTimeout = function (event, callback, duration) {
    var $el = this,
        args = arguments;
    return function(){
        $.fn.oneTimeout.apply($el, args);
    }
};

module.exports = $;
