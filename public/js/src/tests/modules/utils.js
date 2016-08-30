define([
    'require',
    'utils',
    'module',
    'jquery',
    'jasmine-jquery'
], function(require){
    var $ = require('jquery'),
        utils = require('utils'),
        module = require('module'),
        test = function(){


            describe("utils", function(){
                var dummy;
                beforeEach(function(){
                    dummy = {
                        cb: function(){
                            return true;
                        }

                    };
                    spyOn(dummy, 'cb');
                });

                it('has tests setup correctly', function(){
                    expect(module.config().rootPath).toBeDefined();
                });

                it('executes a callback once when scrollTo() is complete', function(done){

                    utils.scrollTo($('footer'), {
                        duration: 300,
                        callback : function(){
                            dummy.cb();
                            expect(dummy.cb.calls.count()).toEqual(1);
                            done();
                        }
                    });
                });

                it('on jumpTo(), will jump to element without trigger scroll', function(){
                    var $body = $('body');
                    utils.jumpTo($body);
                    expect($body.offset().top).toBeLessThan(5);
                });

                it('can get the home url', function(){
                    expect(utils.getRootUrl({trailingSlash : false})).toEqual(location.origin + module.config().rootPath+'/', 'getRootUrl() should return url without trailing slash');
                    expect(utils.getRootUrl({trailingSlash : true})).toEqual(location.origin + module.config().rootPath, 'getRootUrl() should return url with trailing slash');
                });
            });
        };

    return {
        run : test
    };
});