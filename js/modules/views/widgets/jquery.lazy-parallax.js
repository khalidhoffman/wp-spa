define(
    [
        'require',
        'jquery-ui',
        'jquery-visiware'
    ],
    function (require) {

        var $ = require('jquery'),
            $window = $(window);

        return $.widget("dp.lazylax", {
            options: {
                invertDirection: false,

                baseBgXPercent: 50,
                baseBgYPercent: 50,
                maxBgYPercentShift: 20,


                baseBgX : 0,
                baseBgY : 0,
                maxBgShift : 100
            },
            _isActive: false,
            _updateVisiware: function (options) {
                var visibilityProps = {},
                    _options = $.extend({}, options);
                if (_options.scrollStartPoint) visibilityProps['scrollStartPoint'] = _options.scrollStartPoint;
                if (_options.scrollEndPoint) visibilityProps['scrollEndPoint'] = _options.scrollEndPoint;
                console.log("$.lazy-parallax[%O]._$visiwareEl.visiware('update', %O);", this, visibilityProps);
                this._$visiwareEl = this._$visiwareEl.visiware('update', visibilityProps);
                return this;
            },
            isActivated: function () {
                return this._isActive;
            },
            update: function (options) {
                //console.log('jquery.parallax.parallax(\'update\') w/ ', options, this.options);
                this._updateVisiware(options);
                return this;
            },
            activate: function (options) {
                //console.log('activating parallax image...', this);

                var self = this,
                    visiwareOptions = {
                        onVisible: function () {
                            ////console.log('parallax.onVisible() called...');
                            if (!self.isActivated()) {
                                console.trace('receiving visibility events while element is not activated.')
                            } else {
                                var scrollYPosition = $(window).scrollTop(),
                                    scrollStartPoint = this.get('scrollStartPoint'),
                                    scrollEndPoint = this.get('scrollEndPoint'),
                                    currentScrollDiff = (scrollYPosition - scrollStartPoint),
                                    maxScrollDiff = (scrollEndPoint - scrollStartPoint),
                                    shiftMagnitude = (currentScrollDiff / maxScrollDiff),
                                    shiftAmount = -1 * ((self.options.maxBgShift * shiftMagnitude) + self.options.baseBgY);

                                if (self.options.debug) {
                                    console.debug(
                                        "scrollYPosition: %d | shiftMagnitude: %d | scrollStartPoint: %d | scrollEndPoint: %d",
                                        scrollYPosition,
                                        shiftMagnitude,
                                        scrollStartPoint,
                                        scrollEndPoint
                                    );
                                }

                                self.element.css({
                                    'background-position': self.options.baseBgXPercent + "% " + ((self.options.invertDirection) ? -1 * shiftAmount : shiftAmount) + "px"
                                })
                            }
                        }
                    };
                if (self.options.scrollStartPoint) visiwareOptions['scrollStartPoint'] = self.options.scrollStartPoint;
                if (self.options.scrollEndPoint) visiwareOptions['scrollEndPoint'] = self.options.scrollEndPoint;

                console.log('$.lazy-parallax[%O].activate().visiware(%O)', self, visiwareOptions);
                this._$visiwareEl = this.element.visiware(visiwareOptions).visiware('activate');
                this._isActive = true;
                return this;
            },
            deactivate: function (options) {
                console.log('$.lazy-parallax[%O].deactivate(%O)', this, options);
                this._$visiwareEl.visiware('deactivate', options);
                this._isActive = false;
                return this;
            }
        });

    });