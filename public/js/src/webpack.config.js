var path = require('path'),
    url = require('url'),
    fs = require('fs'),


    wpConfig = (function(){
        var config = {
            domain: '127.0.0.1',
            path : '/'
        };
        try {
            var localConfigStr = fs.readFileSync(path.resolve(__dirname, '../../data/wp-spa.config.json')),
                localConfig = JSON.parse(localConfigStr),
                siteURLMeta = url.parse(localConfig.siteURL);
            config.domain = siteURLMeta.host;
            config.path = siteURLMeta.pathname;
        } catch(err){

        }
        return config;
    })(),
    webpack = require('webpack'),
    ModuleReplace = webpack.NormalModuleReplacementPlugin;

module.exports = {
    entry: "./app-dev.js",
    context: __dirname,
    output: {
        path: '../',
        publicPath: wpConfig.path,
        filename: "wp-spa-public.js"
    },
    module: {
        loaders: [{
            test: /\.md$/,
            loader: 'raw!'
        }]
    },
    resolve: {
        modulesDirectories: ['./', '../../../node_modules'],
        root: path.resolve(__dirname),
        extensions: ['', '.js'],
        alias: {
            "build-production": "app-prod",

            "require-lib": "vendors/requirejs/require",
            "domReady": "vendors/domReady/domReady",
            "text": "vendors/text/text",

            "underscore": "vendors/lodash/dist/lodash",
            "backbone": "vendors/backbone/backbone",
            "lightbox": "vendors/lightbox2/dist/js/lightbox",
            "selectize": "vendors/selectize.js/dist/js/standalone/selectize",
            "slick": "vendors/slick/slick/slick",
            "moment": "vendors/moment/moment",

            "jquery-original": "vendors/jquery-3.0.0.min",
            "jquery-ui": "vendors/jquery-ui-1.11.4.custom/jquery-ui",
            "jquery-masonry": "vendors/masonry-custom",
            "jquery-copycss": "vendors/jquery.copycss",
            "lazyload": "vendors/jquery.lazyload",
            "modernizr": "vendors/modernizr-custom",
            "URI": "vendors/URI",
            "live": "vendors/live",
            "masonry": "vendors/masonry.pkgd.min",
            "masonry-imagesloaded": "vendors/imagesloaded",

            "config": "modules/config",
            "null-module": "modules/null-module",
            "utils": "modules/utils",
            "console": "modules/console",
            "google-maps": "modules/views/view-maps",
            "namespace": "modules/namespace",
            "$elements": "modules/jquery-elements",
            "pages-stub": "modules/pages-stub",
            "header": "modules/views/view-header",
            "router": "modules/controllers/router",
            "view-active": "modules/views/view-active",
            "jquery-angled-text": "modules/views/widgets/jquery.angled-text",
            "jquery-clipped": "modules/views/widgets/jquery.clipped",
            "jquery": "vendors/jquery-noconflict",
            "jquery-parallax": "modules/views/widgets/jquery.parallax",
            "jquery-lazy-parallax": "modules/views/widgets/jquery.lazy-parallax",
            "jquery-visiware": "modules/views/widgets/jquery-visiware/jquery.visiware",
            "jquery-morph": "modules/views/widgets/jquery.morph",
            "dp-animate": "modules/views/widgets/jquery.dp-animate",
            "jquery-dp-animate": "modules/views/widgets/jquery.dp-animate"
        }
    },
    shim: {
        "live": [],
        "jquery-ui": {
            "deps": ["jquery"]
        },
        "slick": {
            "deps": ["jquery"]
        },
        "selectize": {
            "deps": ["jquery"],
            "exports": "Selectize"
        },
        "jquery-copycss": {
            "deps": ["jquery"]
        },
        "lazyload": {
            "deps": ["jquery"]
        },
        "masonry": {
            "deps": ["jquery"]
        },
        "lightbox": {
            "deps": ["jquery"]
        },
        'modernizr': {
            "exports": 'Modernizr'
        }
    },
    plugins: [
        // Hack for requirejs's domReady plugin
        new ModuleReplace(/^(domReady\!)$/, 'modules/null-module'),

        // Hack for requirejs's text plugin
        new ModuleReplace(/^text!.+$/, function(ctx) {
            ctx.request = ctx.request.replace(/text!/, 'raw!');
        }),

        // Hack for requirejs's css plugin
        new ModuleReplace(/^css!.+$/, function(ctx) {
            ctx.request = 'style!' + ctx.request;
        })
    ]
};
