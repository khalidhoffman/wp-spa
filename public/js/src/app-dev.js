wp_spa_require([
    'require',
    'live',
    'ng-router',
    'directives',
    'controllers'
], function (require) {
    var router = require('ng-router'),
        controllers = require('controllers'),
        directives = require('directives');

    window.angular.bootstrap(document, ['dp-spa']);

    //$body.append($testBtn);

});
