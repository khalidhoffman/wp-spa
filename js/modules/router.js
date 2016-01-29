define([
    'require',
    'utils',
    'wordpress',
    'ngApp'
], function (require) {
    var ngApp = require('ngApp'),
        utils = require('utils'),
        wordpress = require('wordpress'),
        viewsPath = utils.getRootPath({trailingSlash : false}) + '/wp-content/plugins/wp-spa/views/page.html';
    return ngApp.config(["$routeProvider", function ($routeProvider) {
        console.log('$routeProvider - wordpress pages: %O', wordpress.get('pages'));
        console.log('$routeProvider - wordpress posts: %O', wordpress.get('posts'));
        return $routeProvider
            .when('*', {controller: 'mainController'})
    }]);
});