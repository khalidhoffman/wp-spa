define(
    [
        'require',
        'jquery-parallax',
        'jquery-ui',
        'jquery-visiware'
    ],
    function (require) {

        var $ = require('jquery'),
            $visiware = $.widget( "dp.parallax", {
                options: {
                    invertDirection : false,
                    imgHeight: '100%',
                    backgroundPosition : '50% 50%'
                },
                _get$Container : function() {
                    this.$bgEl = this.$bgEl || this.element.find('.wrap-parallax');
                    return this.$bgEl;
                },
                _get$Image  : function() {
                    this.$bgImage = this.$bgImage || this._get$Container().find('.parallax');
                    return this.$bgImage;
                },
                _maxShiftAmount : function() {
                    this.maxShiftAmount = this.maxShiftAmount || this.options.maxShiftAmount || this.element.parent().attr('maxShift') || 20;
                    return this.maxShiftAmount;
                },
                _isActive: false,
                _updateVisiware : function(options){
                    var visibilityProps = {},
                        args = options || {};
                    if(args.scrollStartPoint) visibilityProps['scrollStartPoint'] = args.scrollStartPoint;
                    if(args.scrollEndPoint) visibilityProps['scrollEndPoint'] = args.scrollEndPoint;
                    //console.log('updating parallax.$visiEl. Passed options:', visibilityProps);
                    this.$visiEl = this._get$Container().visiware('update', visibilityProps);
                    return this;
                },
                _updateCSS : function(options){
                    //this.options = $.extend(options, this.options);
                    $.extend(this.options, options);
                    //console.log('updating jquery.parallax css...',options, this.options);

                    this._get$Container().parent().css({
                        position: 'relative'
                    });

                    //var verticalLimitPercent = (-1 * this._maxShiftAmount()) +"%";
                    this._get$Container().css({
                        bottom: 0,
                        height : '100%',
                        left: '0',
                        overflow: 'hidden',
                        position : 'absolute',
                        top : 0,
                        width : '100%'
                    });

                    this._get$Image().css({
                        //'background-image' : (this.element.data('parallax'))?'url("' +this.element.data('parallax') + '")':'url("http://placehold.it/1000x1000")',
                        'background-position' : this.options.backgroundPosition,
                        'background-repeat' : 'no-repeat',
                        'background-size' : 'cover',
                        //bottom: verticalLimitPercent,
                        bottom: 0,
                        height: this.options.imgHeight,
                        left: '0',
                        position : 'fixed',
                        //top : verticalLimitPercent,
                        top : 0,
                        width: '100%',
                        'z-index' : -1
                    });
                    return this;
                },
                isActivated : function(){
                    return this._isActive;
                },
                update : function(options){
                    //console.log('jquery.parallax.parallax(\'update\') w/ ', options, this.options);
                    this._updateCSS(options);
                    this._updateVisiware(options);
                    return this;
                },
                activate : function(options){
                    //console.log('activating parallax image...', this);

                    this._updateCSS(options);

                    var self = this,
                        visibilityProps = {
                            onVisible : function(){
                                ////console.log('parallax.onVisible() called...');
                                if (!self.isActivated()){
                                    console.trace('receiving visibility events while element is not activated.')
                                } else{
                                    var scrollYPosition = $(window).scrollTop(),
                                        scrollDiff = (scrollYPosition - this.get('scrollStartPoint')),
                                        maxScrollDiff = (this.get('scrollEndPoint')  - this.get('scrollStartPoint')),
                                        shiftPercentage =  1 - (scrollDiff/maxScrollDiff),
                                        shiftAmount =  (self._maxShiftAmount() * shiftPercentage);

                                    if (options && options.debug){
                                        console.log("visiwareWidget.scrollYPosition:", scrollYPosition);
                                        console.log("visiwareWidget.shiftPercentage:", shiftPercentage);
                                        console.log("visiwareWidget.get('scrollEndPoint'):", this.get('scrollEndPoint'));
                                        console.log("visiwareWidget.get('scrollStartPoint'):", this.get('scrollStartPoint'));
                                    }

                                    self._get$Image().css({
                                        transform : 'translateY('+((self.options.invertDirection)?'':'-')+shiftAmount+"%)"
                                    })
                                }
                            }
                        };

                    if(this.options.scrollStartPoint) visibilityProps['scrollStartPoint'] = this.options.scrollStartPoint;
                    if(this.options.scrollEndPoint) visibilityProps['scrollEndPoint'] = this.options.scrollEndPoint;
                    //console.log('initializing parallax.$visiEl. Passed options:', visibilityProps);
                    this.$visiEl = this._get$Container().visiware(visibilityProps);
                    this.$visiEl.visiware('activate');
                    this._isActive = true;
                    return this;
                },
                deactivate : function(options){
                    //console.log('deactivating parallax.visiware...', this.$visiEl);
                    this._isActive = false;
                    this._get$Image().css({
                        transform : 'none',
                        position: 'absolute'
                    });
                    this.$visiEl.visiware('deactivate', options);
                    return this;
                }
            });

        return ($visiware);

    });