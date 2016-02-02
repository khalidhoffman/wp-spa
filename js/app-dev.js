wp_spa_require([
    'require',
    'live',
    'router',
    'directives',
    'controllers'
], function (require) {

    var angular = require('angular');

    angular.bootstrap(document, ['dp-spa']);

    //$body.append($testBtn);

});
