var _ = require('lodash'),
    $ = require('jquery'),

    Module = require('../lib/module');

console.log('head.controller(%O)', arguments);

/**
 * @class HeadDirective
 * @constructor
 */
function HeadDirective(){
    Module.apply(this, arguments);
    var $scope = this,
        $element = $('head');

    this.$element = $element;

    $scope.$on('html:update', function (event, data) {
        var $DOM = data.$DOM;
        console.log("head.link()$scope.$on('view:update')");
        var $head = $DOM.find('head'),
            $newStyles = data.new.$styles;

        // $oldScripts.remove();

        // add new styles to incoming head
        $head.append($newStyles);

        // update meta
        $element.find('meta').remove();
        $element.prepend($head.find('meta'));
        $element.find('title').remove();
        $element.prepend($head.find('title'));

        $scope.$broadcast('head:update', data)
    });
}

HeadDirective.prototype = {

};

_.defaults(HeadDirective.prototype, Module.prototype);

module.exports = HeadDirective;
