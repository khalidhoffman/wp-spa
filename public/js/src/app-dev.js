define([
    'require',
    'ng-router',
    'jquery',
    'directives',
    'controllers'
], function (require) {
    console.log('bootstrapping angular');
    var $ = require('jquery');
    function init(){
        window.angular.bootstrap(document, ['dp-spa']);
    }
    if(document.readyState === "complete") {
        //Already loaded!
        init();
    }
    else {
        $(document).ready(function(){
            init();
        });
    }

});
