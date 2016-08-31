define([
    'require',
    'url',
    'json!../../../../data/wp-spa.config.json',
    'backbone'
], function (require) {
    var Backbone = require('backbone'),
        url = require('url'),
        jsonConfig = require('json!../../../../data/wp-spa.config.json'),
        State = Backbone.Model.extend({
            defaults : {
                siteURL:  jsonConfig.siteURL,
                siteURLMeta:  url.parse(jsonConfig.siteURL),
                useCache: jsonConfig.useCache
            },
            initialize : function(){
                console.log('spaState[%o].initialize()', this);
            }
        });
    return new State();
});