define([
    'require',
    'jquery',
    'ng-app'
], function (require) {
    var $ = require('jquery'),
        ngApp = require('ng-app');

    ngApp.provider('_$template', [function () {

        var self = this,
            $ngContent = $('[ng-view]');

        this.getDefaultContent = function(){
            var $currentNgContent = $('[ng-view]');
            if($currentNgContent.length > 0) $ngContent = $currentNgContent;
            console.log('_$templateProvider.getDefaultContent() - loading HTML from %O', $ngContent);
            return $ngContent.html();
        };

        this.$get = [function () {
            return self;
        }];

        return this;
    }]);
});