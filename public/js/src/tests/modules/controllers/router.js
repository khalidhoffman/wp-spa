define([
    'require',
    'jasmine-jquery',
    'router',
    'test-utils'
], function(require){

    var testUtils = require('test-utils'),
        Router = require('router'),
        test = function(){
            describe('Router', function(){
                var triggerSpy;

                beforeEach(function(){
                    triggerSpy = spyOn(Router, 'trigger').and.callThrough();
                });

                afterEach(function(){

                });

                it('render event is triggered on page navigation', function(done){
                    Router.once('render', function(){
                        expect(Router.trigger).toHaveBeenCalledWith('render');
                        done();
                    });
                    testUtils.navigate(testUtils.getNewTestPagePath());
                })
            })
    };

    return {
        run : test
    };
});