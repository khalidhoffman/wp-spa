define([
    'require',
    'diff-dom',
    'lodash',
    'jquery',
    'modules/services/ast-builder.js',
    'ng-app'
], function (require) {
    var DiffDOM = require('diff-dom'),
        diffDOM = new DiffDOM(),
        skateDomDiff = require('skatejs-dom-diff'),
        _ = require('lodash'),
        $ = require('jquery'),
        AST = require('modules/services/ast-builder.js'),
        ngApp = require('ng-app');
    return ngApp.directive('head', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, controller, transcludeFn) {
                console.log('head.link(%O)', arguments);
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                console.log('head.controller(%O)', arguments);
                var styleSelector = "link[rel='stylesheet']";
                $scope.cache = {
                    styles: []
                };
                $scope.elementChildren = [];

                $scope.format = function($el){
                    console.log('ngHead() - formatting styles');
                    var $head = $el || $element,
                        $styles = $head.find(styleSelector);
                    $styles.appendTo($head);
                };

                function init(){
    
                    $scope.format();

                    $element.each(function(index, el){
                        $scope.elementChildren.push(new AST.DOMNode($(el)));
                    });

                    $scope.$on('view:update', function (event, $DOM, route) {
                        console.log("head.link()$scope.$on('view:update')");
                        var styles = [],
                            $head = $DOM.find('head'),
                            $styles = $head.find(styleSelector),
                            $liveHead = $element,
                            $liveStyles = $element.find(styleSelector).clone(),
                            scripts = [],
                            $scripts = $liveHead.find('script');
                        // console.log('ngHead() - removing styles %o from incoming DOM.head', $styles);
                        // $styles.each(function (styleEl, index) {
                        //     var $style = $(styleEl);
                        //     $style.remove();
                        //     styles.push({
                        //         $style: $style
                        //     })
                        // });
                        
                        // add new styles to incoming head
                        $scope.format($head);
                        $head.append($liveStyles.not(function(index, el){
                            return _.includes($scope.cache.styles, el.href);
                        }));

                        // keep record of added styles
                        $liveStyles.each(function(index, el){
                            $scope.cache.styles.push(el.href);
                        });


                        /*
                        var liveHeadClone = document.createDocumentFragment();
                        var incomingHeadClone = document.createDocumentFragment();

                        liveHeadClone.appendChild($liveHead.clone()[0]);
                        incomingHeadClone.appendChild($head[0]);

                        console.log('ngHead - liveHeadClone.before: %o', liveHeadClone);
                        var instructions = skateDomDiff.diff({
                            // The fragment that you want the source to look like.
                            destination: incomingHeadClone,

                            // The fragment that you want to make look like the destination.
                            source: liveHeadClone
                        });
                        skateDomDiff.patch(instructions);
                        var $result = $(liveHeadClone).find('head');
                        console.log('ngHead - liveHeadClone.after: %o', liveHeadClone);
                        console.log('ngHead - $liveHeadClone.after: %o', $result);
                        */




                        /*
                        var diffs = diffDOM.diff($liveHead[0], $head[0]);
                        console.log("ngHead() - ngHead.view:update - diffDOM = %O", diffs);
                        diffDOM.apply($liveHead[0], diffs);
                        */


                        // apply styles from new DOM.head
                        // console.log('ngHead() - apply styles from incoming DOM.head');
                        // _.forEach(styles, function (styleData, index) {
                        //     styleData.$style.appendTo($liveHead);
                        // });


                        // $element.find('meta').remove();
                        // $element.append($head.find('meta'));
                        // $element.find('title').html($head.find('title').html());
                        $scope.$broadcast('head:update', $DOM, route)
                    });

                }
                init();
            }]
        };
    });

});
