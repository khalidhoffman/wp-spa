require([
    'require',
    'modules/ng-app',
    '$elements',
    'angular',
    'utils'
], function (require) {

    var angular = require('angular');
    angular.bootstrap(document, ['ngApp']);

    //$body.append($testBtn);

});
