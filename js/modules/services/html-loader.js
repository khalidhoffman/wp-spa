define([
    'require',
    'ng-app'
], function (require) {
    var ngApp = require('ng-app');

    ngApp.service('spaContentProvider', ['$http', '$rootScope', function ($http, $rootScope) {
        var self = this;
        this._DOM = document.createElement('html');
        this._cache = [];
        this.$DOM = angular.element(self._DOM);
        console.log('spaContentProvider.constructor()');

        $rootScope.$on('$routeChangeSuccess', function (event, to, from) {
            console.log("spaContent.$rootScope.$on('$routeChangeSuccess')(%O)", arguments);

            var route = (to && to.pathParams) ? to.pathParams.route : './';
            if (self._cache[route]) {
                self.$DOM = self._cache[route];
                console.log('spaContent._cache[%s] = (%O)', route, self.$DOM);
                setTimeout(function(){
                    $rootScope.$apply();
                    $rootScope.$broadcast('view:update', self.$DOM, to, from);
                }, 1);
            } else {
                $http.get(route).then(function success(response) {
                    console.log('spaContent.$http.get.success(%O)', response);
                    self._DOM = document.createElement('html');
                    self._DOM.innerHTML = response.data;
                    self._cache[route] = angular.element(self._DOM);
                    self.$DOM = self._cache[route];
                    $rootScope.$broadcast('view:update', self.$DOM, to, from);
                }, function failure(response) {
                    throw new Error('spaContent.http.get("' + route + '") - Failed:' + response)
                });
            }
        });

        return this;

    }]);
});