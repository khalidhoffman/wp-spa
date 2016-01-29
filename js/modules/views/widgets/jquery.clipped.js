define(["../../utils", "jquery"],function(utils, $){

    $.fn.ClippedBox = function(options){
        var $this = this;
        this.ClippedBoxProps = options || {};
        this.ClippedBoxEls = [];


        /**
         *
         * @returns {jQuery}
         * @constructor
         */
        function Viewport(props){
            var $newViewport = $('<div class="cutoff-content-wrapper"></div>').css({
                overflow : 'hidden'
            });
            $newViewport.slantAngle = parseInt(props.angle) || 0;
            $newViewport.xTranslation  = (typeof props.xTranslation == 'string')?props.xTranslation : '50%';
            $newViewport.yTranslation  = (typeof props.yTranslation == 'string')?props.yTranslation : 0;
            return $newViewport;
        }

        this.each(function(index, el){
            var props = $this.ClippedBoxProps,
                el = el,
                $el = $(el);

            $this.ClippedBoxEls.push($el);

            var parentElement = $el.parent(),
                $parentElement = $($el.parent());

            if ( parentElement == null){
                throw new Error( 'Element is not attached to the DOM.');
            }


            /**
             * default properties
             * @type {{angle: (string|*), xTranslation: (string|*), yTranslation: (string|*)}}
             */
            var mergedProps = {
                angle : $this.ClippedBoxProps.angleDeg || $el.data('angleDeg') || 45,
                xTranslation : $this.ClippedBoxProps.xOffsetPercent || $el.data('xOffsetPercent') || 50,
                yTranslation : $this.ClippedBoxProps.yOffsetPercent || $el.data('yOffsetPercent') || 0,
                autoUpdate : (function(){
                    if($this.ClippedBoxProps.autoUpdate != null){
                        return $this.ClippedBoxProps.autoUpdate
                    } else if($el.data('autoUpdate') != null){
                        return $el.data('autoUpdate');
                    } else{
                        return true
                    }
                })()
            };
            $parentElement.css({
                position : 'relative',
                overflow : 'hidden'
            });

            $el.originalParent = $parentElement;
            $el.createViewport = function(){

                if($el.parent().className != 'cutoff-content-wrapper'){
                    var $newViewport = new Viewport(mergedProps);
                    $newViewport.append($el);
                }
                $el.$outerViewport = $newViewport;
                $parentElement.append($el.$outerViewport);
                props.isActive = true;
            };


            /**
             *
             * @param newAngle [optional]
             * @param translateX [optional]
             * @param translateY [optional]
             */
            $el.updateViewportPosition = function(newAngle, translateX, translateY){
                if (!props.isActive) throw new Error('Tried to update a deactivated element');
                $el.draw(newAngle, translateX, translateY);
            };

            $el.draw = function(newAngle, translateX, translateY){
                var $self = this,
                    $outerViewPort = $el.$outerViewport,

                    angle = newAngle || $outerViewPort.slantAngle,

                    yTranslateValue = translateY || $outerViewPort.yTranslation || 0,
                    xTranslateValue = $outerViewPort.xTranslation-50, //translateX || 50-outerViewPort.xTranslation || 50,

                    scaleXRatio = (el.clientHeight > el.clientWidth)?(el.clientHeight/el.clientWidth)*2.9:2.9,
                    scaleYRatio =  (el.clientWidth > el.clientHeight)?(el.clientWidth/el.clientHeight)*1.5:1.5,

                    transformOrigin = 50+'%' + " 0",

                    transformMarkup = 'translate('+xTranslateValue+'%, '+yTranslateValue+'%) rotateZ('+(-angle)+'deg) scale3d('+scaleXRatio+', '+scaleYRatio+', 1)',
                    invertedTransformMarkup = ' scale3d('+(1/scaleXRatio)+', '+(1/scaleYRatio)+', 1)  rotateZ('+angle+'deg) translate('+(-xTranslateValue)+'%, '+(-yTranslateValue)+'%)';


                $outerViewPort.css({
                    transformOrigin: transformOrigin,
                    transform : transformMarkup
                });

                $self.css({
                    transformOrigin: transformOrigin,
                    transform : invertedTransformMarkup
                });
            };

            if(mergedProps.autoUpdate) {
                $(window).on('resize', function () {
                    if ($el.isActivated()) {
                        $el.updateViewportPosition();
                    }
                });
            }

            $el.createViewport();
            $el.updateViewportPosition();

            /**
             * Adjusts the distance of the cutoff border from the origin
             * @param translateY
             */
            $el.updateYPosition = function(translateY){
                $el.$outerViewport.yTranslation = translateY;
                $el.updateViewportPosition();
                return $this;

            };
            $el.updateAngle = function(angle){
                $el.$outerViewport.slantAngle = angle;
                $el.updateViewportPosition();
                return $el;
            };

            $el.updateXPosition = function (amount){
                $el.$outerViewport.xTranslation = amount;
                $el.updateViewportPosition();
                return $this;
            };


            $el.activate = function(){
                $el.$outerViewport.slantAngle = $el.data('angleDeg');
                $el.$outerViewport.xTranslation = $el.data('xOffsetPercent');
                $el.$outerViewport.yTranslation = $el.data('yOffsetPercent');
                props.isActive = true;
                $el.updateViewportPosition();
                return $this;
            };

            $el.deactivate = function(){
                $el.$outerViewport.slantAngle = 0;
                $el.$outerViewport.xTranslation = 50;
                $el.$outerViewport.yTranslation = 0;
                $el.draw();
                props.isActive = false;
                return $this;
            };

            $el.isActivated = function(){
                return props.isActive;
            };
        });

        this.activate = function(){
            this.ClippedBoxEls.map(function($el, index, arr){
                $el.activate();
            });
            return $this;
        };

        this.deactivate = function(){
            this.ClippedBoxEls.map(function($el, index, arr){
                $el.deactivate();
            });
            return $this;
        };

        this.isActivated = function(){
            this.ClippedBoxEls.map(function($el, index, arr){
                if ($el.isActivated) return true;
            });
            return false;
        };


        return this;
    };

});
