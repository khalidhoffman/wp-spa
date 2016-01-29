define([
    'require',
    'jasmine-jquery',
    'jquery',
    'utils',
    'jquery-visiware'
], function(require){
    var $ = require('jquery'),
        utils = require('utils'),
        test = function(){

            describe("jQuery.visiware", function(){
                var $activatedWidget,
                    _$activatedWidget,
                    numOfScrollListenersBefore,
                    numOfScrollListenersAfter,
                    spy_onScroll,
                    spy_onTick,
                    msPerScroll,
                    msPerTick,
                    msPerTimeout,
                    upperBound,
                    lowerBound,
                    defaultTestSelector = 'footer',
                    randSelectors = [ 'body > div:first-of-type',  'body > div:nth-of-type(2)',  'body > div:nth-of-type(5)', 'body > div:nth-of-type(4)'];

                beforeAll(function(){
                    $activatedWidget = $(defaultTestSelector).visiware();
                    _$activatedWidget = $activatedWidget.visiware('debug').global;
                    msPerScroll = 1500;
                    msPerTick = _$activatedWidget._options.intervalDuration;
                    msPerTimeout = _$activatedWidget._options.timeoutDuration;
                    // use a 25% multiplier to account for inconsistencies in execution
                    upperBound = (msPerScroll/(msPerTick * 1.25)) + (msPerTimeout/msPerTick);
                    lowerBound = (msPerScroll/(msPerTick * 1.25)) - (msPerTimeout/msPerTick);
                });

                beforeEach(function(){
                    $activatedWidget = $(defaultTestSelector).visiware();
                    $activatedWidget.visiware('activate');
                    numOfScrollListenersBefore = -1;
                    numOfScrollListenersAfter = -2;
                    spy_onScroll = spyOn(_$activatedWidget, '_onScroll').and.callThrough();
                    spy_onTick = spyOn(_$activatedWidget, '_onTick').and.callThrough();
                });

                afterEach(function(){
                    $activatedWidget.visiware('deactivate');
                    $activatedWidget.visiware('destroy');
                });

                it("tests are initialized correctly", function(){
                    expect(upperBound).toBeGreaterThan(lowerBound);
                    expect(msPerScroll).toBeGreaterThan(0);
                    expect(msPerTick).toBeGreaterThan(0);
                    expect(msPerTimeout).toBeGreaterThan(0);
                    expect(lowerBound).toBeGreaterThan(0);
                    expect(_$activatedWidget._instances).not.toBeNull();
                    expect(_$activatedWidget._isListening).not.toBeNull();
                    var numOfTestSelectors = randSelectors.length;
                    for(var i = 0; i < numOfTestSelectors; i++){
                        expect($(randSelectors[i])).toBeInDOM()
                    }
                });

                it("will not have more than one listener for multiple activations", function(){
                    numOfScrollListenersBefore = $._data(window, "events").scroll.length;
                    var $visiEls = [],
                        numOfTestSelectors = randSelectors.length;
                    for(var i = 0; i < numOfTestSelectors; i++){
                        $visiEls.push($(randSelectors[i]).visiware());
                        $visiEls[i].visiware('activate');
                    }
                    numOfScrollListenersAfter = $._data(window, "events").scroll.length;
                    expect(numOfScrollListenersAfter).toEqual(numOfScrollListenersBefore);
                    expect(_$activatedWidget._isListening).toBe(true);
                    for(i = 0; i < numOfTestSelectors; i++){
                        $visiEls[i].visiware('deactivate');
                    }
                });

                describe("instance", function(){

                    describe("once flag", function(){
                        var _widgetInstance;

                        beforeEach(function(done){
                            $activatedWidget.visiware('deactivate', {
                                removeAll :true
                            });
                            done();
                        });

                        it("removes instance after initial callback execution if set to true", function(done){
                            $activatedWidget = $(defaultTestSelector).visiware({
                                scrollStartPoint : ($activatedWidget.offset().top - 50),
                                once : true
                            });
                            $activatedWidget.visiware('activate');
                            _widgetInstance = $activatedWidget.visiware('debug').instance;
                            var context = this,
                                onScrollComplete = function(){
                                // tests
                                expect(_$activatedWidget._find(_widgetInstance)).toBeNull();
                                expect(_widgetInstance._isInstanceListening).toBe(false);
                                done();
                            };
                            expect(_$activatedWidget._isListening).toBe(true);
                            expect($activatedWidget).toBeInDOM();
                            expect(_$activatedWidget._find(_widgetInstance)).not.toBeNull();
                            expect(_$activatedWidget._find(_widgetInstance)).toBeDefined();
                            utils.jumpTo($('body'));
                            utils.scrollTo($activatedWidget, {
                                duration : msPerScroll,
                                context : context,
                                callback : function(){
                                    onScrollComplete.apply(null);
                                }
                            });
                        });

                        it("will resume instance per default settings if set to false", function(done){
                            $activatedWidget = $(defaultTestSelector).visiware({
                                scrollStartPoint : ($activatedWidget.offset().top - 50),
                                once : false
                            });
                            $activatedWidget.visiware('activate');
                            _widgetInstance = $activatedWidget.visiware('debug').instance;
                            _$activatedWidget = $activatedWidget.visiware('debug').global;
                            var onScrollComplete = function(){
                                // tests
                                expect(_$activatedWidget._find(_widgetInstance)).not.toBeNull();
                                expect(_$activatedWidget._find(_widgetInstance)).toBeDefined();
                                expect(_$activatedWidget._isListening).toBe(true);
                                expect(_widgetInstance._isInstanceListening).toBe(true);
                                done();
                            };
                            expect(_$activatedWidget._isListening).toBe(true);
                            expect(_$activatedWidget._find(_widgetInstance)).not.toBeNull();
                            expect(_$activatedWidget._find(_widgetInstance)).toBeDefined();
                            utils.jumpTo($('body'));
                            utils.scrollTo($activatedWidget, {
                                duration : msPerScroll,
                                callback : function(){
                                    onScrollComplete.apply();
                                }
                            });
                        })

                    });

                    it("is listening  upon activation", function(){
                        $activatedWidget.visiware('deactivate', {
                            removeAll : true
                        });
                        $activatedWidget = $(defaultTestSelector).visiware();
                        $activatedWidget.visiware('activate');
                        var _widgetInstance = $activatedWidget.visiware('debug').instance;
                        expect(_widgetInstance._isInstanceListening).toBe(true);
                    });

                    it("continues listening after scrolling per default settings", function(done){

                        $activatedWidget.visiware('deactivate', {
                            removeAll :true
                        });

                        $activatedWidget = $(defaultTestSelector).visiware({
                            scrollStartPoint : ($activatedWidget.offset().top - 50),
                            once : false
                        });
                        $activatedWidget.visiware('activate');
                        var _widgetInstance = $activatedWidget.visiware('debug').instance,
                            onScrollComplete = function(){
                                // tests
                                expect(_widgetInstance._isInstanceListening).toBe(true);
                                done();
                            };
                        utils.jumpTo($('body'));
                        utils.scrollTo($activatedWidget, {
                            duration : msPerScroll,
                            callback : function(){
                                onScrollComplete.apply();
                            }
                        });
                    });

                    it("can be activated multiple times without affecting global timing", function(done){
                        var onScrollComplete = function(){
                            // tests
                            expect(_$activatedWidget._onTick.calls.count()).toBeGreaterThan(lowerBound);
                            done();
                        };
                        utils.jumpTo($('body'));
                        for(var i = 0; i < 5; i++){
                            $activatedWidget.visiware('activate');
                        }
                        expect(_$activatedWidget._isListening).toBe(true);
                        expect($activatedWidget.visiware('isActive')).toBe(true);
                        _$activatedWidget._onTick.calls.reset();
                        utils.scrollTo($('footer'), {
                            duration : msPerScroll,
                            callback : function(){
                                onScrollComplete.apply();
                            }
                        });
                    });

                    it("removes all visiware instances when 'empty' function called.", function(){
                        $activatedWidget.visiware('empty');
                        expect(_$activatedWidget._isListening).toBe(false);
                        expect(_$activatedWidget._instances.length).toEqual(0);
                    });

                    it("will remove all listeners when stopListening flag is true", function(){
                        var $visiEls = [],
                            numOfTestSelectors = randSelectors.length;
                        $visiEls.push($('body > div:first-of-type').visiware());
                        $visiEls[0].visiware('activate');
                        numOfScrollListenersBefore = $._data(window, "events").scroll.length;

                        for(var i = 1; i < numOfTestSelectors; i++){
                            $visiEls.push($(randSelectors[i]).visiware());
                            $visiEls[i].visiware('activate');

                            if( i == (numOfTestSelectors - 1) ){
                                $visiEls[i].visiware('deactivate',{
                                    stopListening : true
                                });
                            }
                        }
                        numOfScrollListenersAfter = $._data(window, "events").scroll.length;
                        expect(numOfScrollListenersBefore - 1).toEqual(numOfScrollListenersAfter);
                        expect(_$activatedWidget._isListening).toBe(false);
                    });

                    it("will remove all listeners when removalAll flag is true", function(){
                        var $visiEls = [],
                            numOfTestSelectors = randSelectors.length;
                        $visiEls.push($('body > div:first-of-type').visiware());
                        $visiEls[0].visiware('activate');
                        numOfScrollListenersBefore = $._data(window, "events").scroll.length;

                        for(var i = 1; i < numOfTestSelectors; i++){
                            $visiEls.push($(randSelectors[i]).visiware());
                            $visiEls[i].visiware('activate');

                            if( i == (numOfTestSelectors - 1) ){
                                $visiEls[i].visiware('deactivate',{
                                    removeAll : true
                                });
                            }
                        }
                        numOfScrollListenersAfter = $._data(window, "events").scroll.length;
                        expect(numOfScrollListenersBefore - 1).toEqual(numOfScrollListenersAfter);
                        expect(_$activatedWidget._isListening).toBe(false);
                    });

                    it("will remove all visiware instances when removalAll flag is true", function(){
                        var $visiEls = [],
                            numOfTestSelectors = randSelectors.length;
                        $visiEls.push($(randSelectors[0]).visiware());
                        $visiEls[0].visiware('activate');
                        numOfScrollListenersBefore = $._data(window, "events").scroll.length;

                        for(var i = 1; i < numOfTestSelectors; i++){
                            $visiEls.push($(randSelectors[i]).visiware());
                            $visiEls[i].visiware('activate');

                            if( i == (numOfTestSelectors - 1) ){
                                $visiEls[i].visiware('deactivate',{
                                    removeAll : true
                                });
                            }
                        }
                        numOfScrollListenersAfter = $._data(window, "events").scroll.length;
                        expect(_$activatedWidget._instances.length).toEqual(0);
                        expect(_$activatedWidget._isListening).toBe(false);
                    });

                });

                describe('when not scrolling', function(){

                    beforeEach(function(done){

                        setTimeout(function(){
                            _$activatedWidget._onTick.calls.reset();
                            done();
                        }, msPerTimeout);

                    });

                    it("withholds execution per default settings", function(done){

                        setTimeout(function(){
                            expect(_$activatedWidget._onTick.calls.count()).toBeLessThan((msPerTimeout/msPerTick)+1);
                            done();
                        }, 4000);
                    });


                    it("fires regardless if 'onScrollOnly' flag is set to false on instance initialization", function(done){
                        var $temp = $(randSelectors[3]).visiware({
                                onScrollOnly : false
                            }),
                            waitTime = 4000;

                        $temp.visiware('activate');
                        expect(_$activatedWidget._isListening).toBe(true);

                        setTimeout(function(){
                            expect(_$activatedWidget._onTick.calls.count()).toBeGreaterThan(waitTime/(msPerTick * 1.25));
                            $temp.visiware('deactivate');
                            done();
                        }, waitTime);

                    });

                });

                describe('when scrolling', function(){

                    beforeEach(function(){
                        utils.jumpTo($('body'));
                        _$activatedWidget._onTick.calls.reset();
                    });

                    it("executes per defaults settings", function(done){
                        var onScrollComplete = function(){
                                expect(_$activatedWidget._isListening).toBe(true);
                                expect(_$activatedWidget._onTick.calls.count()).toBeGreaterThan(lowerBound);
                                done();
                            };
                        expect(_$activatedWidget._isListening).toBe(true);
                        setTimeout(function(){
                            utils.scrollTo($('footer'), {
                                duration : msPerScroll,
                                callback : function(){
                                    onScrollComplete.apply();
                                }
                            });
                        }, msPerTimeout)

                    });

                    it("will not execute for a single visiware instance after that instance has been deactivated", function(done){
                        $activatedWidget.visiware('deactivate', {
                            removeAll: true
                        });

                        numOfScrollListenersBefore = $._data(window, "events").scroll.length;
                        var $visiEls = [],
                            numOfTestSelectors = randSelectors.length;

                        for(var index = 0; index < numOfTestSelectors; index++){
                            $visiEls.push($(randSelectors[index]).visiware());
                        }

                        var tempInactiveVisiInstanceIndex = 1,
                            tempActiveVisiInstanceIndex = 2,
                            temporaryInactiveVisiInstance = $visiEls[tempInactiveVisiInstanceIndex].visiware('debug').instance,
                            temporaryActiveVisiInstance = $visiEls[tempActiveVisiInstanceIndex].visiware('debug').instance;

                        spyOn(temporaryInactiveVisiInstance, '_onScroll');
                        spyOn(temporaryActiveVisiInstance, '_onScroll');

                        for(index = 0; index < numOfTestSelectors; index++){
                            $visiEls[index].visiware('activate');
                            if(index == tempInactiveVisiInstanceIndex) $visiEls[index].visiware('deactivate');
                        }

                        utils.scrollTo($('footer'), {
                            duration : msPerScroll,
                            callback : function(){
                                expect(temporaryInactiveVisiInstance._onScroll).not.toHaveBeenCalled();
                                expect(temporaryActiveVisiInstance._onScroll).toHaveBeenCalled();
                                temporaryActiveVisiInstance.deactivate();
                                numOfScrollListenersAfter = $._data(window, "events").scroll.length;
                                expect(numOfScrollListenersBefore).toEqual(numOfScrollListenersAfter);
                                done();
                            }
                        });
                    });

                    it("will continue to listen even if a single element is deactivated multiple times", function(done){
                        var $temp = $(randSelectors[0]).visiware(),
                            context = this,
                            args = arguments,
                            onScrollComplete = function(){
                                //tests
                                expect(_$activatedWidget._onTick.calls.count()).toBeGreaterThan(lowerBound);
                                expect(_$activatedWidget._isListening).toBe(true);
                                $temp.visiware('deactivate');
                                done();
                            };

                        $temp.visiware('activate');
                        expect(_$activatedWidget._isListening).toBe(true);

                        for(var i = 0; i < 5; i++){
                            $activatedWidget.visiware('deactivate');
                        }

                        utils.scrollTo($('footer'), {
                            duration : msPerScroll,
                            callback : function(){
                                onScrollComplete.apply(context, args);
                            }
                        });
                    });

                    it("continues to listen globally event if a single widget is deactivated", function(done){
                        var $temp = $(randSelectors[1]).visiware(),
                            context = this,
                            args = arguments,
                            onScrollComplete = function(){
                                //tests
                                expect(_$activatedWidget._onTick.calls.count()).toBeGreaterThan(lowerBound);
                                expect(_$activatedWidget._isListening).toBe(true);
                                $temp.visiware('deactivate');
                                done();
                            };

                        $temp.visiware('activate');
                        expect(_$activatedWidget._isListening).toBe(true);
                        $activatedWidget.visiware('deactivate');
                        utils.scrollTo($('footer'), {
                            duration : msPerScroll,
                            callback : function(){
                                onScrollComplete.apply(context, args);
                            }
                        });
                    });

                    it("does not execute if there are no instances present", function(done){
                        $activatedWidget.visiware('empty');
                        utils.scrollTo($('footer'), {
                            duration: 1500,
                            callback : function(){
                                expect(_$activatedWidget._onTick).not.toHaveBeenCalled();
                                expect(_$activatedWidget._isListening).toBe(false);
                                done();
                            }
                        });
                    });


                    it("fires when 'onScrollOnly' flag is set to true on initialization", function(done){
                        var $temp = $(randSelectors[3]).visiware({
                                onScrollOnly : true
                            }),
                            onScrollComplete = function(){
                                expect(_$activatedWidget._onTick.calls.count()).toBeGreaterThan(lowerBound);
                                expect(_$activatedWidget._isListening).toBe(true);
                                done();
                            };
                        $temp.visiware('activate');

                        expect(_$activatedWidget._isListening).toBe(true);
                        utils.scrollTo($('footer'), {
                            duration: msPerScroll,
                            callback : function(){
                                onScrollComplete.apply();
                            }
                        });
                    });

                    it("fires when 'onScrollOnly' flag is set to true on activate call", function(done){
                        var $temp = $(randSelectors[3]).visiware({
                                onScrollOnly : false
                            }),
                            onScrollComplete = function(){
                                expect(_$activatedWidget._onTick.calls.count()).toBeGreaterThan(lowerBound);
                                expect(_$activatedWidget._isListening).toBe(true);
                                done();
                            };

                        $temp.visiware('activate',{
                            onScrollOnly : true
                        });

                        expect(_$activatedWidget._isListening).toBe(true);
                        utils.scrollTo($('footer'), {
                            duration: msPerScroll,
                            callback : function(){
                                onScrollComplete.apply();
                            }
                        });

                    });
                });
            });
        };

    return {
        run : test
    };
});