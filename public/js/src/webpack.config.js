var path = require('path'),
    url = require('url'),
    fs = require('fs'),


    webpack = require('webpack'),
    ModuleReplace = webpack.NormalModuleReplacementPlugin;

module.exports = {
    entry: "app.js",
    context: __dirname,
    output: {
        path: path.join(process.cwd(), 'public/js/'),
        filename: "wp-spa-public.js"
    },
    module: {
        loaders: [
            {
                test: /\.md$/,
                loader: 'raw!'
            },
            {
                test: /jquery/,
                loader: "expose?jQuery"
            }
        ]
    },
    resolve: {
        root: __dirname,
        modulesDirectories: ['./', path.join(process.cwd(), 'node_modules')],
        extensions: ['', '.js'],
        alias: {
            "ng-app": "modules/ng-app",
            "ng-router": "modules/ng-router",
            "ng-state": "modules/ng-state",
            "directives": "modules/directives/index",
            "controllers": "modules/controllers/index",

            "wordpress": "modules/models/wordpress",
            "config": "modules/config",
            "null-module": "modules/null-module",
            "utils": "modules/utils",

            "live": "vendors/live",
            "moment": "vendors/moment/moment",
            "underscore": "lodash"
        }
    },
    shim: {
        "live": [],
        'modernizr': {
            "exports": 'Modernizr'
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress : {
                drop_console : true,
                drop_debugger : true
            }
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        // Hack for requirejs's domReady plugin
        new ModuleReplace(/^(domReady\!)$/, 'modules/null-module'),

        // Hack for requirejs's text plugin
        new ModuleReplace(/^text!.+$/, function (ctx) {
            ctx.request = ctx.request.replace(/text!/, 'raw!');
        }),

        // Hack for requirejs's css plugin
        new ModuleReplace(/^css!.+$/, function (ctx) {
            ctx.request = 'style!' + ctx.request;
        })
    ],
    node: {
        'path': true,
        'url': true
    }
};
