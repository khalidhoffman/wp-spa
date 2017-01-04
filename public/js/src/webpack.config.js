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

            // overrides
            "jquery": "vendors/jquery-wp",
            "backbone": "vendors/backbone-wp",

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
            jQuery: "jquery"
        })
    ],
    node: {
        'path': true,
        'url': true
    }
};
