var utils = require("utils"),
    Module = require('modules/lib/module');

/**
 * @param {Object} [options]
 * @param {String} [options.indicatorType]
 * @param {String} [options.indicatorColor]
 * @constructor
 */
function LoadingView(options) {
    this.$loadingView = $(require("raw!./../views/html/loading-view.html"));
    this.$loadingIcon = this.$loadingView.find('.wp-spa-loading-view__icon');
    this.$loadingBar = this.$loadingView.find('.wp-spa-loading-view__progress-bar');
    this.config = utils.defaults(options, {
        loadingClassName: 'wp-spa-loading-view--loading',
        indicatorType: 'indeterminate',
        indicatorColor: ''
    });
    this.$loadingView.addClass('wp-spa-loading-view--' + this.config.indicatorType);
    this.state = {
        hasLoaded: false,
        progress: 0
    };
}

LoadingView.prototype = {

    /**
     *
     * @param {Number} amount
     */
    show: function (amount) {
        this.$loadingView.addClass(this.config.loadingClassName);
        if (this.config.indicatorType == 'progress' && (amount === 0 || amount > 0)) this.setLoadingProgress(amount);
    },

    reset: function(){
        this.state.progress = 0;
        this.state.hasLoaded = false;
        this.$loadingView.removeClass(this.config.loadingClassName);
        this.$loadingBar.css({
            'opacity': ''
        });
    },

    setLoadingProgress: function (amount) {
        var self = this;

        if (!this.state.progress) {
            this.state.progress = 0;
            this.$loadingBar.css({'transform': 'translate3d(0, 0, 0)'});
        }

        // use amount only if higher than current progress
        this.state.progress = amount && amount > this.state.progress ? amount : this.state.progress;
        switch (amount) {
            case 100:
                clearTimeout(this.state.autoIncrementTimeoutId);
                this.state.hasLoaded = true;
                this.$loadingBar.css({
                    'transform': 'translate3d(100%, 0, 0)',
                    'opacity': '0'
                });
                setTimeout(function () {
                    // hide everything
                    self.reset();
                }, 1000);
                break;
            case 0:
            default:
                this.$loadingBar.css({'transform': 'translate3d(' + self.state.progress + '%, 0, 0)'});
                this.state.autoIncrementTimeoutId = setTimeout(function () {
                    if (self.state.progress < 75 && !self.state.hasLoaded) self.show(self.state.progress + 2)
                }, 500);
                break;
        }

    },

    hide: function () {
        if (this.config.indicatorType == 'progress') {
            this.setLoadingProgress(100);
        } else {
            var self = this;
            self.$loadingView.find('.wp-spa-loading-view__icon').css({opacity: 0});
            setTimeout(function () {
                // hide everything
                self.$loadingView.find('.wp-spa-loading-view__icon').css({opacity: ''});
                self.$loadingView.removeClass(self.config.loadingClassName);
            }, 650);
        }
    },

    appendTo: function ($body) {
        this.$indicator = this.config.indicatorType == 'progress' ? this.$loadingBar : this.$loadingIcon;
        this.$indicator.css({
            'background-color': this.config.indicatorColor
        });
        $body.append(this.$loadingView);
    }
};

module.exports = LoadingView;
