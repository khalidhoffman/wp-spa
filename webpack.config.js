var path = require('path'),
    url = require('url'),
    fs = require('fs'),


    wpConfig = (function(){
        var config = {
            domain: '127.0.0.1',
            path : '/'
        };
        try {
            var localConfigStr = fs.readFileSync(path.resolve(__dirname, 'data/wp-spa.config.json')),
                localConfig = JSON.parse(localConfigStr),
                siteURLMeta = url.parse(localConfig.siteURL);
            config.domain = siteURLMeta.host;
            config.path = siteURLMeta.pathname;
        } catch(err){
            console.warn(err);
        }
        return config;
    })(),
    webpack = require('webpack'),
    ModuleReplace = webpack.NormalModuleReplacementPlugin;

module.exports = {
    entry: "app-dev.js",
    context: path.resolve(__dirname, 'public/js/src/'),
    output: {
        path: './public/js/',
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
        root: path.resolve(__dirname, 'public/js/src/'),
        modulesDirectories: ['./', '../../../node_modules'],
        extensions: ['', '.js'],
        alias: {
            "build-production": "app-prod",

            "require-lib": "vendors/requirejs/require",
            "domReady": "vendors/domReady/domReady",
            "text": "vendors/text/text",

            "underscore": "lodash",
            "backbone": "vendors/backbone/backbone",
            "moment": "vendors/moment/moment",

            "jquery-original": "vendors/jquery-3.0.0.min",
            "modernizr": "vendors/modernizr-custom",
            "live": "vendors/live",

            "ng-app": "modules/ng-app",
            "directives": "modules/directives/index",
            "controllers": "modules/controllers/index",
            "ng-router": "modules/router",
            "wordpress": "modules/models/wordpress",

            "config": "modules/config",
            "null-module": "modules/null-module",
            "utils": "modules/utils",
            "console": "modules/console",
            "google-maps": "modules/views/view-maps",
            "namespace": "modules/namespace",
            "$elements": "modules/jquery-elements",
            "header": "modules/views/view-header",
            "router": "modules/controllers/router",
            "view-active": "modules/views/view-active",
            "jquery-angled-text": "modules/views/widgets/jquery.angled-text",
            "jquery-clipped": "modules/views/widgets/jquery.clipped",
            "jquery": "vendors/jquery-noconflict"
        }
    },
    shim: {
        "live": [],
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
