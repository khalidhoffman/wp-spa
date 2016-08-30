define([
    'require',
    'jquery'
], function (require) {

    return {
        start: function () {
            var $ = require('jquery'),
                $window = $(window);

            require([
                'require',
                'test-utils',
                'jasmine-boot',
                'tests/modules/views/view-active',
                'tests/modules/utils',
                'tests/modules/controllers/router',
                'tests/modules/models/wordpress',
                'tests/modules/views/widgets/jquery.morph',
                'tests/modules/views/widgets/jquery.parallax',
                'tests/modules/views/widgets/jquery.visiware',
                'tests/modules/views/widgets/jquery.dp-animate'
            ], function (require) {
                console.log('Jasmine - init tests.');

                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;

                function onLoad() {

                    require('tests/modules/views/view-active').run();
                    require('tests/modules/utils').run();
                    require('tests/modules/controllers/router').run();
                    require('tests/modules/models/wordpress').run();
                    require('tests/modules/views/widgets/jquery.morph').run();
                    require('tests/modules/views/widgets/jquery.parallax').run();
                    //require('tests/modules/views/widgets/jquery.visiware').run();
                    require('tests/modules/views/widgets/jquery.dp-animate').run();
                    describe('BASE_LOGIC', function () {

                        var index = 1;

                        afterAll(function (done) {
                            require('test-utils').navigate('/', {
                                callback: function () {
                                    done();
                                }
                            })
                        });

                        it('access all variables in array when counting down an array', function () {
                            var callbacks = [];
                            for (var i = 0; i < 10; i++) {
                                var obj = {
                                    newFunction: function () {
                                        return 1 + 1;
                                    }
                                };
                                callbacks.push(obj);
                                spyOn(callbacks[i], 'newFunction');
                            }
                            var callbackIndex = callbacks.length;
                            while (callbackIndex--) {
                                callbacks[callbackIndex].newFunction.call();
                            }
                            for (i = 0; i < 10; i++) {
                                expect(callbacks[i].newFunction).toHaveBeenCalled();
                            }
                        });
                    });
                }

                $(onLoad);
                $window.trigger('load');
            })
        }
    }

});