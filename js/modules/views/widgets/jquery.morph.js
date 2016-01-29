define(
    [
        'require',
        'jquery-ui',
        'jquery-copycss',
        'dp-animate'
    ],
    function (require) {

        var $ = jQuery,
            $window = $(window);

        return $.widget( "dp.morph", {
            options : {
                from : "header > div:first-child",
                to : "header > div:first-child + div",
                duration: '1000ms',
                timing : 'ease',
                fadeOutDuration : 1000,
                isFadeOut : true
            },
            _init : function(){

            },
            play : function(){
                this.$fromEl = (this.options.from.jquery)?this.options.from:$(this.options.from);
                this.$toEl = (this.options.to.jquery)?this.options.to:$(this.options.to);
                this._moveTo(this.$fromEl, this.$toEl);
            },
            _generateDuplicate : function($original, isDeepCopy){
                var $duplicate = $original.clone(false, false); // we use properties (false, falase) to avoid copying events/data;
                if(!isDeepCopy) $duplicate.html('');
                return $duplicate;
            },
            _moveTo : function($from, $to){
                var self = this,
                    $fromCopyEl = this._generateDuplicate($from),
                    fromOffset = $from.offset(),
                    fromCSSProperties = {
                        transform : 'translate3d(0, 0, 0)',
                        'transition-property': 'top, left, height, width, transform',
                        'transition-duration': this.options.duration,
                        'transition-timing-function': this.options.timing,
                        display: 'block',
                        position: 'fixed',
                        top: (fromOffset.top%$window.height())+'px', // we avoid using scrollTop() which is 0 when the pages are undergoing animation
                        left: fromOffset.left+'px',
                        width: $from.width()+'px',
                        height: $from.height()+'px',
                        'z-index' : 9999
                    },
                    onAnimationEnd = function(){
                        $to.css({
                            visibility : 'visible'
                        });
                        $fromCopyEl.remove();
                        if (self.options.onAnimationEnd) self.options.onAnimationEnd.apply(self, arguments);
                    };

                //console.log('morph_fromCSSProperties', fromCSSProperties);
                $fromCopyEl.addClass('morph').appendTo($('body'));
                $fromCopyEl.copyCSS($from[0]);
                $fromCopyEl.css(fromCSSProperties);
                $to.css({
                    visibility : 'hidden'
                });
                if (self.options.onAnimate) self.options.onAnimate.apply(self, arguments);
                $fromCopyEl.animate({
                    top: 0,
                    left: 0,
                    width: $to.width(),
                    height: $to.height()
                },{
                    useKeyFrames : true,
                    done : function(){
                        if (self.options.onFadeOut) self.options.onFadeOut.apply(self, arguments);
                        if(self.options.isFadeOut){
                            $fromCopyEl.fadeOut(self.options.fadeOutDuration, onAnimationEnd);
                        } else {
                            setTimeout(function(){
                                onAnimationEnd.apply(self);
                            }, self.options.fadeOutDuration);
                        }
                    }
                });

            }
        })

    });