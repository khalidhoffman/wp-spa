define([
    'require',
    'lodash',
    'modules/services/content-service',
    "diff-dom",
    'ng-app'
], function (require) {
    var _ = require('lodash'),
        DiffDOM = require('diff-dom'),
        diffDOM = new DiffDOM(),
        ngApp = require('ng-app');
    console.log("require('modules/directives/body')");
    return ngApp.directive('body', function () {
        return {
            restrict: 'AE',
            controller : ['$scope', '$element', '$location', 'contentService', function($scope, $element, $location,contentService){
                console.log('ngBody.controller.initialize()');

                interceptAction = function(evt){
                    var href = evt.currentTarget.href;
                    if(contentService.wordpress.hasPageSync(href) || contentService.wordpress.hasPostSync(href)){
                        evt.preventDefault();
                        $location.url(href);
                    }
                };

                $scope.destroyClickables = function(){
                    if($scope.clickables) $scope.clickables.off('click', null, interceptAction);
                    delete $scope.clickables;
                };

                $scope.createClickables = function(){
                    console.log('setting clickables');
                    $scope.clickables = $element.find('[href]');
                    if($scope.interceptAction) $scope.clickables.on('click', interceptAction);
                };

                $scope.sanitize = function(){
                    $scope.clickables.each(function(index, el){
                        this.setAttribute('ng-href', this.href);
                    });
                };

                $scope.createClickables();


                $scope.$on('view:update', function (event, $DOM) {
                    $scope.destroyClickables();
                    console.log("body.controller.$scope.$on('view:update')");
                    // var $body = $DOM.find('body');
                    var $body = $DOM.find('body'),
                        diffs = diffDOM.diff($element[0],  $body[0]);
                    console.log("body.diffDOM = %O", diffs);
                    diffDOM.apply($element[0], diffs);
                    var $ngView = $element.find('[ng-view]');
                    console.log('sanitizing ngView: %o', $ngView);
                    $ngView.removeAttr('ng-cloak');

                    _.forEach($body[0].attributes, function(attr, index){
                        $element.attr(attr.name, attr.value);
                    });

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
