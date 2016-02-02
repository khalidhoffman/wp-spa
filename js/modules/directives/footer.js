define([
    'require',
    "router",
    "diff-dom",
    'ng-app'
], function (require) {
    var ngApp = require('ng-app'),
        DiffDOM = require("diff-dom"),
        diffDOM = new DiffDOM();
    return ngApp.directive('footer', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, controller, transcludeFn) {
                console.log('footer.link(%O)', arguments);
                element.find('[href]').each(function (index, el) {
                    this.setAttribute('ng-href', this.href);
                });

                scope.$on('view:update', function (event, $DOM) {
                    var diffs = diffDOM.diff(element[0],  $DOM.find('footer')[0]);
                    console.log("footer.link().diffDOM = %O", diffs);
                    diffDOM.apply(element[0], diffs);
                    element.trigger('view:update');
                });
            }
            //,
            //controller: ['$scope', '$element', 'spaContentProvider', function ($scope, $element, spaContentProvider) {
            //    console.log('footer.controller(%O)', arguments);
            //    $scope.html = spaContentProvider.$DOM.find('footer').html() || '<h1>Initializing...</h1>';
            //    $scope.scriptCache = [];
            //    $element.find('script').each(function (index, script) {
            //        console.log("footer.controller().$element.find('script') - saving %s", script.outerHTML);
            //        $scope.scriptCache.push((script.src || script.innerHTML))
            //    })
            //}]
        };
    });

});