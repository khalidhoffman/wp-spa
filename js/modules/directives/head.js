define([
    'require',
    "router",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');
    return ngApp.directive('head', function () {
        return {
            restrict: 'AE',
            link : function(scope, element, attrs, controller, transcludeFn){
                console.log('head.link(%O)', arguments);
                element.find('[href]').each(function(index, el){
                    this.setAttribute('ng-href', this.href);
                });

                scope.$on('view:update', function(event, $DOM){
                    scope.html = $DOM.find('head').html();
                    element.find('meta').remove();
                    element.append($DOM.find('head meta'));
                    element.find('title').html($DOM.find('title').html());
                    element.trigger('view:update');
                });
            },
            controller : ['$scope', 'spaContentProvider', function($scope, spaContentProvider){
                console.log('head.controller(%O)', arguments);
                $scope.html = spaContentProvider.$DOM.find('head').html() || '<h1>Initializing...</h1>';
            }]
        };
    });

});/**
 * Created by kah8br on 1/31/16.
 */
