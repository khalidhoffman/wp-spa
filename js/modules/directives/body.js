define([
    'require',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');
    return ngApp.directive('body', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, controller, transcludeFn) {
                console.log('body.link(%O)', arguments);

                scope.attributes = element[0].attributes;
                scope.numOfAttrs = scope.attributes.length;

                scope.$on('view:update', function (event, $DOM) {
                    console.log("body.link().scope.$on('view:update')");
                    var $body = $DOM.find('body'),
                        attribute;
                    scope.attributes = $body[0].attributes;
                    scope.numOfAttrs = scope.attributes.length;
                    console.log("body.link().scope.$on('view:update') - updating w/ %O", scope.attributes);
                    for(var index = 0; index < scope.numOfAttrs; index++){
                        attribute = scope.attributes[index];
                        element.attr(attribute.name, attribute.value);
                    }
                    element.trigger('view:update');
                });
            }
        };
    });

});
