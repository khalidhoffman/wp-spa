define([
    'require',
    'jquery',
    'ng-app'
], function (require) {
    var $ = require('jquery'),
        ngApp = require('ng-app');

    ngApp.provider('_$template', [function () {

        var self = this,
            $currentNgContentElement = $('[ng-view]');

        this.getDefaultContent = function(){
            var $ngContentElement = $('[ng-view]');
            if($ngContentElement.length > 0) $currentNgContentElement = $ngContentElement;
            console.log('_$templateProvider.getDefaultContent() - loading HTML from %O', $currentNgContentElement);
            return $currentNgContentElement.html();
        };

        this.$get = [function () {
            return self;
        }];

        return this;
    }]);
});