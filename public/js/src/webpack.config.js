var path = require('path'),
    url = require('url'),
    fs = require('fs'),

    webpack = require('webpack');

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
                test: /history/,
                loader: "exports?History"
            }
        ]
    },
    resolve: {
        root: __dirname,
        modulesDirectories: ['./', path.join(process.cwd(), 'node_modules')],
        extensions: ['.js', ''],
        alias: {
            "directives": "modules/directives/index",
            "controllers": "modules/controllers/index",

            "utils": "modules/lib/utils",

            // overrides
            "jquery": "vendors/jquery-wp",

            "live": "vendors/live",
            "history": "vendors/native.history"
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
            compress: {
                drop_console: true,
                drop_debugger: true
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
