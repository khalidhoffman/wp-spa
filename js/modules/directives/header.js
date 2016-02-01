define([
    'require',
    "router",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');
    return ngApp.directive('header', function () {
        return {
            restrict: 'AE',
            link : function(scope, element, attrs, controller, transcludeFn){
                console.log('header.link(%O)', arguments);
                element.find('[href]').each(function(index, el){
                    this.setAttribute('ng-href', this.href);
                });

                scope.$on('view:update', function(event, $DOM){
                    scope.html = $DOM.find('header').html();
                    element.html(scope.html);
                    element.trigger('view:update');
                });
            },
            controller : ['$scope', 'spaContentProvider', function($scope, spaContentProvider){
                console.log('header.controller(%O)', arguments);
                $scope.html = spaContentProvider.$DOM.find('ng-content').html() || '<h1>Initializing...</h1>';
            }]
        };
    });

});