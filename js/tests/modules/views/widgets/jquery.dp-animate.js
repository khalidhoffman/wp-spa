define([
    'require',
    'jasmine-jquery',
    'jquery',
    'underscore',
    'test-utils',
    'dp-animate'
],function(require){
    var $ = require('jquery'),
        testUtils = require('test-utils'),
        _ = require('underscore');

    function test() {
        describe("DP-Animate", function () {

            var dpAnimate,
                $el = $("<div id='test-body' class='test-class'></div>").appendTo('body'),
                //defaultSelector = "<div class='container-test'></div>",
                defaultSelector = "#"+$el.attr('id'),
                cssObject = {
                    transition : 'background-color 500ms ease',
                    position : 'fixed',
                    top : 0,
                    bottom : 0,
                    left: 0,
                    height: '100%',
                    width : '100%',
                    'background-color' : "rgba(0,0,0,0.5)",
                    'z-index' : 1
                },
                rawCSS = '#test-body.test-class{' +
                    'transition: background-color 500ms ease;' +
                    'position: fixed;' +
                    'top: 0;' +
                    'bottom: 0;' +
                    'left: 0;' +
                    'height: 100%;' +
                    'width: 100%;' +
                    'background-color: rgba(0, 0, 0, 0.5);' +
                    'z-index: 1;' +
                    '}',
                cssAnimationObject = {
                    left : 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    transform : 'scale(0.5)'
                },
                rawCSSAnimation = '@keyframes anim1 { ' +
                    '100% { ' +
                    'left: 0; ' +
                    'top: 0; ' +
                    'width: 100%; ' +
                    'height: 100%; ' +
                    'transform: scale(0.5); ' +
                    '} ' +
                    '} ' +
                    '#test-body.test-class{ ' +
                    'animation:anim1 600ms ease;' +
                    '};';

            /*
             Steps:

             X1. Parse jQuery argument into generic object with CSS properties

                1a. Convert CSS properties to prefixed/legacy/etc. versions

                1a+. Convert CSS properties to animation keyframes

                    1a+.A. Generate unique id for animation keyframe name
                    1a+.B. Add unique animation to CSS Class

             2. Convert CSS Object to CSS-ready string
                    2a+.A. Covert keyframes to CSS-ready string

             X3. Write CSS-ready string to style object

             X4. Append style object

             */

            beforeEach(function(){
                $el = $(defaultSelector);
                dpAnimate = new require('dp-animate')($el);
            });

            afterAll(function(){
               $el.css({
                   backgroundColor : 'transparent'
               })
            });

            it("tests are initialized correctly", function(){
               expect($el[0]).toBeInDOM();
            });

            it("parses same number of arguments as jquery animate", function () {
                expect((require('jquery')().animate).length).toEqual((dpAnimate.animate).length);
            });

            it("generates an appropriate selector the provided element", function(){
                var testDataCollection = [
                        {
                            selector : '.test-class',
                            html: "<div class='test-class'></div>"
                        },
                        {
                            selector : '#test-id',
                            html: "<div id='test-id'></div>"
                        },
                        {
                            selector : '#test-id.test-class',
                            html: "<div id='test-id' class='test-class'></div>"
                        }
                    ],
                    DPAnimate = require('dp-animate'),
                    dpAnimInstance,
                    $element,
                    testData,
                    testDataCollectionLength = testDataCollection.length;
                for(var i = 0; i < testDataCollectionLength; i++){
                    testData = testDataCollection[i];
                    $element = $(testData.html);
                    dpAnimInstance = new DPAnimate($element);
                    expect(dpAnimInstance.generateSelector()).toEqual(testData.selector);
                }
            });

            it("parses a generic css object to a css-style text", function(done){
                var result = dpAnimate.parse(cssObject);
                testUtils.compileSass(rawCSS, function(compiledCSS){
                    expect(result.length).toEqual(compiledCSS.length);
                    expect(result).toEqual(compiledCSS);
                    done();
                });
            });

            describe("useKeyframes option", function(){

                it("generates a keyframe animation", function(){
                    var result = dpAnimate.parse(cssObject, {useKeyFrames : true});
                    expect(result.indexOf('keyframes')).toBeGreaterThan(-1, 'index of keyframes');
                });

                it("does not generates a keyframe animation when set to false", function(){
                    var result = dpAnimate.parse(cssObject, {useKeyFrames : false});
                    expect(result.indexOf('keyframes')).toBeLessThan(0, 'index of keyframes');
                });

                it("generates the correct css text for animation", function(done){

                    var result = dpAnimate.parse(cssAnimationObject, {useKeyFrames : true});
                    testUtils.compileSass(rawCSSAnimation, function(compiledCSS){
                        expect(result.length).toEqual(compiledCSS.length, 'css text lengths');
                        expect(result).toEqual(compiledCSS);
                        done();
                    });
                })

            });


            describe("jquery extension", function(){

                it("is part of the jquery ecosystem", function(){
                    expect($el.dpAnimate).toBeDefined();
                    expect(_.isFunction($el.dpAnimate)).toBe(true);
                });

                it("returns the jquery object on initialization", function(){
                    var $result = $el.dpAnimate();
                    expect($result.jquery).toBeTruthy();
                });

            });

            describe("generated style nodes", function(){
                var $styleNode,
                    styleNode;

                beforeEach(function(){
                    $styleNode = dpAnimate.generateStyleNode(cssObject);
                    styleNode = $styleNode[0];
                });

                it("are style nodes", function(){
                    expect(styleNode.tagName.toLowerCase()).toEqual('style');
                });

                it("are dom elements", function(){
                    expect(_.isElement(styleNode)).toBe(true);
                });

                it("contain the appropriate styles after being appended", function(){
                    var $appendStyleNode = $styleNode.appendTo('body'),
                        parsedHTML = dpAnimate.parse(cssObject),
                        appendedStyleNodeInnerHTML = $appendStyleNode.html();
                    expect(appendedStyleNodeInnerHTML).toEqual(parsedHTML)
                })
            })
        })
    }
    return {
        run : test
    }
});