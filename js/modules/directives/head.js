define([
    'require',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');
    return ngApp.directive('head', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, controller, transcludeFn) {
                console.log('head.link(%O)', arguments);
                element.find('[href]').each(function (index, el) {
                    this.setAttribute('ng-href', this.href);
                });

                scope.$on('view:update', function (event, $DOM) {
                    console.log("head.link().scope.$on('view:update')");
                    var $head = $DOM.find('head');
                    element.find('meta').remove();
                    element.append($head.find('meta'));
                    element.find('title').html($head.find('title').html());
                    element.trigger('view:update');
                });
            }
            //,
            //controller : ['$scope', 'spaContentProvider', function($scope, spaContentProvider){
            //    console.log('head.controller(%O)', arguments);
            //    $scope.html = spaContentProvider.$DOM.find('head').html() || '<h1>Initializing...</h1>';
            //}]
        };
    });

});
