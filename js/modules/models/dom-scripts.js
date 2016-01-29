define(
    [
        'require',
        '$elements',
        'router',
        'namespace',
        'backbone'
    ],
    function(require){
        var Backbone = require('backbone'),
            starterPack = require('$elements'),
            NS = require('namespace'),
            Router = require('router'),
            DOMScript = Backbone.Model.extend({
                defaults : {
                    src : false,
                    type : 'text/javascript',
                    data : [
                        {
                            name: 'default',
                            value : ''
                        }
                    ],
                    content : false,
                    reference : null
                }
            }),
            DOMScriptCollection = Backbone.Collection.extend({
                model : DOMScript,
                initialize : function(){
                    //console.log('DOMScriptCollection.initialize() executed.');
                    var self = this;
                    this.$body = starterPack.body;
                    this.listenTo(Router, 'view:attached', function(data){
                        //console.log('DOMScriptCollection.onViewAttached - attaching:', data.$toDOM);
                        self._write$DOM.apply(self, [data.$toDOM]);
                    });
                    this._readDOM();
                },
                scriptCache : {

                },
                _writeContent : function(namespace, $element){
                    //console.log('DOMScriptCollection._writeContent() called.');
                    var self = this,
                        namespace = namespace || 'page';
                    this.scriptCache[namespace] = $element.find('script');
                    _.forEach(this.scriptCache[namespace], function(script, index, arr){
                        var $script = Backbone.$(script);
                        if(!self.hasScript($script)){
                            console.debug('DOMScriptCollection._writeContent() - appending script', script);
                            self.$body.append($script);
                            self.add({
                                src : $script.attr('src'),
                                content : ($script.attr('src'))?false:$script.html()
                            })
                        }
                    });
                },
                _write$DOM : function($DOM){
                    var self = this;

                    // add new scripts
                    this._writeContent('header', $DOM.find('header'));
                    this._writeContent('footer', $DOM.find('footer'));

                    // save the recently added scripts
                    this._readDOM();
                    _.forEach($DOM[0].scriptCache, function(scriptEl, index, arr){
                        var $script = Backbone.$(scriptEl);
                        ////console.log('DOMScriptCollection._parseContent$DOM() - check for: ', $script);
                        if(!self.hasScript($script) && ($script.attr('type') == 'text/javascript' || $script.attr('type') == '')){
                            self.add({
                                src : $script.attr('src'),
                                content : ($script.attr('src'))?false:$script.html()
                            });
                            var script = document.createElement( 'script' );
                            script.type = 'text/javascript';
                            if ($script.attr('src')) script.src = $script.attr('src');
                            if (!$script.attr('src')) script.innerHTML = $script.html();
                            console.debug('DOMScriptCollection._write$DOM() - appending script', script);
                            self.$body.append(script);
                        }
                    });
                },
                _readDOM : function(){
                    var self = this;
                    this.$body.find('script').each(function(index, el, arr){
                        if(!self.hasScript(el)){
                            self.add({
                                src : el.src,
                                content : (!el.src)?(el.innerHTML || Backbone.$(el).html()):false
                            })
                        }
                    });
                },
                /**
                 *
                 * @param $script {jQuery|Element}
                 * @returns {boolean}
                 */
                hasScript : function($script){
                    if(!$script.jquery) $script = Backbone.$($script);
                    var result = false;
                    _.forEach(this.models, function(script, index, arr){
                        ////console.log('DOMScriptCollection.hasScript() searching for:', script.attributes);
                        ////console.log('DOMScriptCollection.hasScript() - script.get(\'src\')['+script.get('src')+'] == '+ $script.attr('src')+'|'+(script.get('src') && $script.attr('src') == script.get('src')));
                        if((script.get('src') && script.get('src') == $script.attr('src')) ||  (script.get('content') &&  script.get('content') == $script.html())){
                            result = true;
                            ////console.log('DOMScriptCollection.hasScript() found script in DOM record:', script);
                        }
                    });
                    return result;
                }
            });

        NS.ExternalScripts = new DOMScriptCollection();
        return NS.ExternalScripts;
    });