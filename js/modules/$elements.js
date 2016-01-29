define(['jquery'], function ($) {
    var NS = require('namespace'),
        $window = $(window),
        $html = $('html'),
        $body = $html.find('body'),
        $header = $body.find('header'),
        $footer = $body.find('footer'),
        $wpMeta = $body.find('#wp-meta');
    return {
        body: $body,
        $body: $body,
        footer: $footer,
        $footer: $footer,
        header: $header,
        $header: $header,
        html: $html,
        $html: $html,
        window: $window,
        $window: $window,
        wpMeta: $wpMeta,
        $wpMeta: $wpMeta
    };
});