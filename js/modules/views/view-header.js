define(
    [
        'require',
        '$elements',
        'backbone',
        'namespace',
        'utils',
        'config',
        'domReady!'
    ],
    function(require){

        var Backbone = require('backbone'),
            NameSpace = require('namespace'),
            utils = require('utils'),
            config = require('config'),
            starterPack = require('$elements'),
            HeaderView = Backbone.View.extend({
                initialize : function(){
                    var self = this,
                        staterPack;
                    this.$window = starterPack.$window;
                    this.$window.on('scroll', function(){
                        self.onScroll.apply(self, arguments);
                    });
                    this.onScroll();
                },
                events : {
                    'click .toggle-header' : 'toggle'
                    //'click .link-logo, .menu-item' : 'toggle'
                    //'click .link-social' : 'softToggle'
                },
                onScroll : function(){
                    if (!this.$el.hasClass('toggled') && this.$window.scrollTop() > config.header.height.default){
                        this.$el.addClass('alt');
                    } else {
                        this.$el.removeClass('alt');
                    }
                },
                toggle : function(evt){
                    if(evt && evt.preventDefault) evt.preventDefault();
                    if(this.$el.hasClass('toggled')){
                        this.$el.removeClass('toggled alt');
                        this.$el.addClass('hidden');
                    } else {
                        this.$el.addClass('toggled');
                        this.$el.removeClass('hidden');
                    }
                    this.onScroll();
                },
                softToggle : function(evt){
                    if(this.$el.hasClass('toggled')){
                        this.$el.removeClass('toggled');
                        this.$el.addClass('hidden');
                    } else {
                        this.$el.addClass('toggled');
                        this.$el.removeClass('hidden');
                    }
                    this.onScroll();
                }
            });


        var el = Backbone.$('header')[0];
        NameSpace.HeaderView = (el)? new HeaderView({el: el}):HeaderView;
        return NameSpace.HeaderView;
    });