define([
    'require',
    "router",
    "modules/services/html-loader",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');
    return ngApp.directive('ngContent', function () {
        return {
            restrict: 'AE',
            link : function(scope, element, attrs, controller, transcludeFn){
                element.find('[href]').each(function(index, el){
                    this.setAttribute('ng-href', this.href);
                });

                scope.$on('view:update', function(event, $DOM){
                    console.log('ngContent.link().scope.$on(view:update)', arguments);
                    scope.html = $DOM.find('ng-content').html();
                    element.html(scope.html);
                    element.trigger('view:update');
                });
            },
            controller : ['$scope', 'spaContentProvider', function($scope, spaContentProvider){
                console.log('ngContent.controller(%O)', arguments);
                $scope.html = spaContentProvider.$DOM.find('ng-content').html() || '<h1>Initializing...</h1>';
            }]
        };
    });

});