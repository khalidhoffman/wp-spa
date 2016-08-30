define([
    'require',
    'backbone',
    'ng-app'
], function (require) {
    var Backbone = require('backbone'),
        ngApp = require('ng-app');

    ngApp.provider('$_state', function () {

        var self = this,
            State = Backbone.Model.extend({
                defaults : {

                }
            });

        this._state = new State();

        this.$get = [function () {
            return self._state;
        }];

        return this;
    });
});