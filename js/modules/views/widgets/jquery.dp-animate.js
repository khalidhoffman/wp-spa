define([
    'require',
    'jquery'
],function(require){
    /*
     Steps:

     X-1. Parse jQuery argument into generic object with CSS properties

     1a. Convert CSS properties to prefixed/legacy/etc. versions

         1a+. Convert CSS properties to animation keyframes

             1a+.A. Generate unique id for animation keyframe name

             1a+.B. Add unique animation to CSS Class

     2. Convert CSS Object to CSS-ready string

        2a+.A. Covert keyframes to CSS-ready string

     X-3. Write CSS-ready string to style object

     X-4. Append style object

     */
    var $ = require('jquery');

    var JqueryParser = function(){
        var self = this;

        /**
         * Parses your standard jquery animate arguments for dp-animate
         * @param properties {object}
         * @param duration
         * @param easing
         * @param complete
         * @returns {object}
         */
        self.parse = function(properties, duration, easing, complete){
            return properties;
        };

        return {
            parse : self.parse
        }
    };

    var Selectify = function(element){
        var self = this;

        self.getSelector = function(){
            if(!element) throw new Error("Selectify received a null element");
            var el = (element.jquery)?(element[0]):element;
            if(!el) {
                console.error('Selectify called w/', element);
                throw new Error("Selectify received an empty jQuery element");
            }
            var $el = (element.jquery)?element:$(element);
            var selector = '',
                spaceRegex = /[\s]+/g;
            if (el.id){
                selector += '#'+el.id
            }
            if($el.attr('class')){
                selector += '.'+$el.attr('class').replace(spaceRegex,'.');
            }
            return selector;
        };

        return {
            getSelector : self.getSelector
        };
    };

    var CSSWriter = function(element){
        if(!element) throw new Error("CSS Writer received a null element");
        var el = (element.jquery)?element[0]:element,
            $el = (element.jquery)?element:$(element),
            selector = new Selectify($el).getSelector(),
            originalCSSProperties = {},
            self = this;

        self.formatCSSProperty = function(name, value){
            var cleanupRegex = /[\s][\s]+|,[\s]+/g;

            return name +':' + value.toString().replace(cleanupRegex,' ');
        };

        self.compileCSSBlock = function(cssProperties){
            var cssText = '{',
                propertyIndex = 0;
            for (var cssProperty in cssProperties) {
                if (cssProperties.hasOwnProperty(cssProperty)) {
                    if(propertyIndex > 0)  cssText += ';';
                    cssText += self.formatCSSProperty(cssProperty, cssProperties[cssProperty]);
                    propertyIndex++;
                }
            }
            cssText += '}';
            return cssText;
        };

        self.compileCSSTransition = function(cssProperties){
            var cssText = '';
                cssText += selector;
            cssText += self.compileCSSBlock(cssProperties)+'\n';
            return cssText;
        };

        self.compileCSSAnimation = function(cssProperties){
            var animationIdentifier = 'anim1',
                animationCSSText = '';

            function compileStartText(){
                return '';
            }

            function compileKeyframesStartText(){
                return '@keyframes '+animationIdentifier+'{';
            }

            function compileAnimationFrameText(options){
                var settings = $.extend({
                        step : '0%',
                        cssProperties : cssProperties
                    }, options),
                    text = ''+settings.step;
                text += self.compileCSSBlock(settings.cssProperties);
                return text;
            }

            function compileKeyframesEndsText(){
                return '}';
            }

            function compileEndText(){
                return '\n';
            }

            animationCSSText += compileStartText();
            animationCSSText += compileKeyframesStartText();
            //animationCSSText += compileAnimationFrameText({
            //    step : '0%',
            //    cssProperties : originalCSSProperties
            //});
            animationCSSText += compileAnimationFrameText({
                step : '100%',
                cssProperties : cssProperties
            });
            animationCSSText += compileKeyframesEndsText();
            animationCSSText += selector + self.compileCSSBlock({
                    animation : animationIdentifier+ ' 600ms ease'
                });
            animationCSSText += compileEndText();

            return animationCSSText;
        };

        /**
         *
         * @param cssProperties
         * @param options
         * @returns {string}
         */
        self.compile = function(cssProperties, options){
            var settings = $.extend({
                    useKeyFrames : false
                }, options);

            if(settings.useKeyFrames){
                return self.compileCSSAnimation(cssProperties);
            } else{
                return self.compileCSSTransition(cssProperties)
            }
        };

        return {
            compile : this.compile
        }
    };

    var DpAnimate = function(element){
        if(!element) throw new Error("dp-animate received a null element");
        var el = (element.jquery)?element[0]:element,
            $el = (element.jquery)?element:$(element),
            selectify = new Selectify($el),
            cssWriter = new CSSWriter($el),
            jqueryParser = new JqueryParser();

        return {
            animate : jqueryParser.parse,
            parse : cssWriter.compile,
            generateStyleNode : function(properties, options){
                var cssObj = jqueryParser.parse.apply(jqueryParser, arguments),
                    styleHTML = cssWriter.compile(cssObj, options),
                    $styleNode = $('<style type="text/css"></style>').html(styleHTML);

                return $styleNode;
            },
            generateSelector : function(){
                return selectify.getSelector();
            }
        }
    };

    $.fn.dpAnimate = function(properties, options){
        var self = this,
            settings = $.extend({
                timeout : 3000
            }, options),
            $$el = new DpAnimate(this),
            $styleNode = $$el.generateStyleNode.apply($$el, arguments),
            timeoutId = null;
        $styleNode.appendTo('head');
        var onAnimationEnd = function(){
            if(timeoutId) clearTimeout(timeoutId);
            if(settings.done) settings.done.apply(self, [settings]);
            //$styleNode.remove();
        };
        self.one('transitionend animationend', onAnimationEnd);
        timeoutId = setTimeout(onAnimationEnd, settings.timeout);
        return this;
    };

    return DpAnimate;

});