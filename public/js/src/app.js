var $ = require('jquery'),

    WPSPA = require('./modules/app'),
    Controllers = require('./modules/controllers'),
    Directives = require('./modules/directives');

$(function () {
    var app = new WPSPA(),
        mainController = new Controllers.Main(app),
        animationController = new Controllers.Animation(app),
        html = new Directives.Html(app),
        head = new Directives.Head(app);
});
