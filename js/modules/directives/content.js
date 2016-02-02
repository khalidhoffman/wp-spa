define([
    'require',
    "router",
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
                    element.html($DOM.find('div[ng-view]').html());
                    element.trigger('view:update');
                });
            }
        };
    });

});