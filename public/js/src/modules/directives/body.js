define([
    'require',
    'lodash',
    'modules/services/content-service',
    "diff-dom",
    'utils',
    "jquery",
    'ng-app'
], function (require) {
    var _ = require('lodash'),
        $ = require('jquery'),
        utils = require('utils'),
        DiffDOM = require('diff-dom'),
        diffDOM = new DiffDOM(),
        ngApp = require('ng-app');
    console.log("require('modules/directives/body')");
    return ngApp.directive('body', function () {
        return {
            restrict: 'AE',
            controller: ['$scope', '$element', '$location', 'contentService', function ($scope, $element, $location, contentService) {
                console.log('ngBody.controller.initialize()');

                function interceptAction(evt) {
                    console.log('ngBody.interceptAction()');
                    var href = evt.currentTarget.href;
                    console.log('ngBody.interceptAction() - intercepting route to %s', href);
                    if (contentService.wordpress.hasPageSync(href) || contentService.wordpress.hasPostSync(href)) {
                        console.log('ngBody.interceptAction()  - routing to %s', utils.getPathFromUrl(href));
                        evt.preventDefault();
                        $scope.$apply(function () {
                            $location.path(utils.getPathFromUrl(href));
                        });
                    }
                }

                $scope.destroyClickables = function () {
                    console.log('ngBody.destroyClickables()');
                    if ($scope.clickables) $scope.clickables.off('click', null, interceptAction);
                    delete $scope.clickables;
                };

                $scope.createClickables = function () {
                    console.log('ngBody.createClickables()');
                    $scope.clickables = $element.find('[href]');
                    if (interceptAction) $scope.clickables.on('click', interceptAction);
                };

                $scope.sanitize = function () {
                    $scope.clickables.each(function (index, el) {
                        this.setAttribute('ng-href', this.href);
                    });
                };

                $scope.createClickables();


                $scope.$on('head:update', function (event, $DOM, route) {
                    console.log("body.controller.$scope.$on('view:update')");
                    $scope.destroyClickables();
                    // var $body = $DOM.find('body');
                    var $body = $DOM.find('body'),
                        $spaContent = $body.find('.spa-content__content'),
                        $liveSPAContent = $element.find('.spa-content__content');
                    console.log('body.view:update - new $spaContent: %o', $spaContent);

                    // remove scripts from new DOM.body
                    // var scripts = [],
                    //     $scripts = $spaContent.find('script');
                    // console.log('removing scripts from incoming DOM.body');
                    // $scripts.each(function (scriptEl, index) {
                    //     var $script = $(scriptEl),
                    //         $parent = $script.parent(),
                    //         parentId = route + index;
                    //     $parent.attr('data-spa-parent-id', parentId);
                    //     $script.remove();
                    //     scripts.push({
                    //         parentId: parentId,
                    //         $script: $script
                    //     })
                    // });

                    // update DOM.body
                    // console.log('ngBody.view:update - updating DOM.body.spa-content');
                    // var diffs = diffDOM.diff($liveSPAContent[0], $spaContent[0]);
                    // console.log("ngBody.view:update - diffDOM = %O", diffs);
                    // diffDOM.apply($liveSPAContent[0], diffs);
                    // $element.find('script').remove();
                    $liveSPAContent.replaceWith($spaContent);

                    _.forEach($body[0].attributes, function (attr, index) {
                        $element.attr(attr.name, attr.value);
                    });

                    // apply scripts from new DOM.body
                    // console.log('apply scripts from incoming DOM.body')
                    // _.forEach(scripts, function (scriptData, index) {
                    //     scriptData.$script.appendTo($element.find("[data-spa-parent-id='" + scriptData.parentId +"']"));
                    // });

                    // remove ng-cloak
                    // var $ngView = $element.find('[ng-view]');
                    // $ngView.removeAttr('ng-cloak');


                    $scope.createClickables();
                    $scope.sanitize();
                });

            }],
            link: function (scope, element, attrs, controller, transcludeFn) {
                console.log('body.link(%O)', arguments);
            }
        };
    });

});

