define(
    [
        'require',
        'utils',
        'namespace',
        'backbone'
    ],
    function(){
        var Backbone = require('backbone'),
            NS = require('namespace'),
            utils = require('utils'),
            WordPress = Backbone.Model.extend({
                defaults : {
                    pages : [],
                    posts : [],
                    record : []
                },
                initialize : function(){
                    this.downloadSiteMap();
                },
                isReady : function(){
                    return  (this.get('record').length >= 4);
                },
                downloadSiteMap : function(options){
                    var self = this,
                        args = options || {};
                    Backbone.$.ajax({
                        url: utils.getRootUrl(true) + '?show_sitemap',
                        dataType: 'json',
                        complete : function($response, responseStatus){
                            var siteMap = $response.responseJSON;
                            //console.log('WordPress downloaded sitemap data: ', siteMap);
                            _.forEach(siteMap, function(hrefs, post_type, arr){
                                //console.log('WordPress is processing: ',arguments);
                                switch(post_type) {
                                    case 'page':
                                        self.set('pages', hrefs);
                                        break;
                                    case 'archive':
                                        break;
                                    default:
                                        self.set('posts', _.uniq(self.get('posts').concat(hrefs)));
                                }
                                //self[post_type] = hrefs;
                                var wpSavedRecord = self.get('record');
                                if(!_.includes(wpSavedRecord, post_type)) {
                                    wpSavedRecord.push(post_type);
                                    self.set('record', wpSavedRecord);
                                }
                            });
                            //console.log('WordPress processed sitemap data: ', self);
                            if(args.callback) args.callback.apply(args.context, [self[namespace]]);
                        }
                    });
                },
                getPages : function(){
                    if(!this.isReady()){
                        //this.downloadPages();
                        return false;
                    }
                    return this.get('pages');
                },
                getPosts : function(){
                    if(!this.isReady()){
                        //this.downloadPosts();
                        return false
                    }
                    return this.get('posts');
                },
                hasPage : function(url){
                    var result = false,
                        requestedUrl =  utils.sanitizeUrl(url),
                        pages = this.get('pages');
                    if(pages.length == 0)  {
                        //console.trace('WordPress not yet initialized.');
                        return false;
                    }
                    return _.includes(pages, requestedUrl);
                },
                hasPost : function(url){
                    var result = false,
                        requestedUrl =  utils.sanitizeUrl(url),
                        posts = this.get('posts');
                    if(posts.length == 0) {
                        //console.trace('WordPress not yet initialized.');
                        return false;
                    }
                    return _.includes(posts, requestedUrl);
                }
            });
        NS.WordPress = new WordPress();
        return NS.WordPress;
    });