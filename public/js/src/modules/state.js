define([
    'require',
    'backbone'
], function (require) {
    var Backbone = require('backbone'),
        State = Backbone.Model.extend({
            defaults : {

            }
        });
    return new State();
});