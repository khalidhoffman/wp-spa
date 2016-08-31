define([
    'require',
    'backbone'
], function (require) {
    var Backbone = require('backbone'),
        State = Backbone.Model.extend({
            defaults : {

            },
            initialize : function(){
                console.log('spaState[%o].initialize()', this);
            }
        });
    return new State();
});