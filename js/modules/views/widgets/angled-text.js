define(['backbone', '../../namespace','utils', 'domReady!'],
    /**
     *
     * @param Backbone
     * @param NameSpace
     * @param Utils
     * @param DOM {Document}
     * @returns {*}
     */
    function(Backbone, NameSpace, Utils, DOM){
        NameSpace = NameSpace || {};

        NameSpace.AngledContentView = Backbone.View.extend({
            initialize: function(){
                this.cache = {};
                jQuery(window).resize(this.draw.bind(this));
            },
            render : function(){
                this.draw();
            },
            draw : function(args){

                this.$('.space-holder').remove();
                args = args || {};
                var index = 0,
                    $clippedImageEl = this.$('.clipped-image'),
                    $window = Backbone.$(window),
                    clipDegrees = $clippedImageEl.data('angleDeg'),
                    startWidth = args.startWidth || ( function(){
                            var xDiff = Math. tan((clipDegrees-90)*(Math.PI/ 180))*$clippedImageEl.height(),
                                smallestLength = $clippedImageEl.width() - xDiff;
                            return  100 * smallestLength / $window.width();
                        })(),
                    endWidth = args.endWidth || 100* ($clippedImageEl.width() / $window.width()),
                    numOfSlantedLines = $clippedImageEl.height() / 16,
                    lengthIncrease = (endWidth - startWidth) / numOfSlantedLines,
                    $textContainerEl = this.$('.wrap-angled-text');
                //console.log('measurements:', 'start: '+startWidth, 'end: '+ endWidth, clipDegrees+'deg');
                for (var currentWidth = startWidth; currentWidth < endWidth; currentWidth += lengthIncrease) {

                    var tempSpacerEl = document.createElement("div");
                    tempSpacerEl.className = 'space-holder';
                    tempSpacerEl.style.maxWidth = currentWidth + '%';
                    tempSpacerEl.style.visibility = 'hidden';
                    tempSpacerEl.style.float = 'right';
                    tempSpacerEl.style.clear = 'right';
                    if (currentWidth == startWidth){
                        this.cache.firstSpacer = tempSpacerEl;
                    } else if ((currentWidth + lengthIncrease) >= endWidth){
                        this.cache.lastSpacer = tempSpacerEl;
                    }
                    $textContainerEl[0].insertBefore(tempSpacerEl, $textContainerEl[0].firstChild);
                }

            }
        });

        return NameSpace.AngledContentView;
    }
);