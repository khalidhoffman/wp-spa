define([
    'require',
    "router",
    "diff-dom",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app'),
        DiffDOM = require("diff-dom"),
        diffDOM = new DiffDOM();
    return ngApp.directive('header', function () {
        return {
            restrict: 'AE',
            link : function(scope, element, attrs, controller, transcludeFn){
                console.log('header.link(%O)', arguments);
                element.find('[href]').each(function(index, el){
                    this.setAttribute('ng-href', this.href);
                });

                scope.$on('view:update', function(event, $DOM){
                    var diffs = diffDOM.diff(element[0],  $DOM.find('header')[0]);
                    console.log("header.link().diffDOM = %O", diffs);
                    diffDOM.apply(element[0], diffs);
                    element.trigger('view:update');

                    element.trigger('view:update');
                });
            }
            //,
            //controller : ['$scope', 'spaContentProvider', function($scope, spaContentProvider){
            //    console.log('header.controller(%O)', arguments);
            //    $scope.html = spaContentProvider.$DOM.find('ng-content').html() || '<h1>Initializing...</h1>';
            //}]
        };
    });

});