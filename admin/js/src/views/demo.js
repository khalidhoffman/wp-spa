var $ = require('jquery');

$.fn.wpspaDemo = function (options) {
    var $demo = this,
        opts = {
            playInterval: 3000,
            animatingClassName: 'wpspa-demo--animating',
            animationDuration: 1000
        },
        state = {
            isAnimating: false,
            animationName: ''
        },
        $animationDisplay = $demo.find('.wpspa-demo__demo_el'),
        $animationSetting = $demo.find('select');

    $animationDisplay.css({
        animationDuration: opts.animationDuration + 'ms'
    });

    $animationSetting.on('change', function () {
        state.isAnimating = true;
        state.animationName = this.value;
    });

    function startAnimation() {
        // add animate className
        $demo.addClass(opts.animatingClassName);
        $animationDisplay.css({
            animationName: state.animationName
        })
    }

    function resetAnimation() {
        // reset className after animation done
        $demo.removeClass(opts.animatingClassName);
        $animationDisplay.css({
            animationName: ''
        })
    }

    setInterval(function () {
        if (state.isAnimating) {
            startAnimation();
        }

        setTimeout(function () {
            resetAnimation();
        }, opts.animationDuration + 150);

    }, opts.playInterval)
};