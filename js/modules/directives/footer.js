define([
    'require',
    "router",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');
    return ngApp.directive('footer', function () {
        return {
            restrict: 'AE',
            link : function(scope, element, attrs, controller, transcludeFn){
                console.log('footer.link(%O)', arguments);
                element.find('[href]').each(function(index, el){
                    this.setAttribute('ng-href', this.href);
                });

                scope.$on('view:update', function(event, $DOM){
                    element.find('> div').replaceWith($DOM.find('footer > div'));
                    element.trigger('view:update');
                });
            },
            controller : ['$scope', 'spaContentProvider', function($scope, spaContentProvider){
                console.log('footer.controller(%O)', arguments);
                $scope.html = spaContentProvider.$DOM.find('footer').html() || '<h1>Initializing...</h1>';
            }]
        };
    });

});