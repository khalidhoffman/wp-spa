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
        modulesDirectories: [__dirname, path.join(process.cwd(), 'node_modules')],
        extensions: ['.js', ''],
        alias: {
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
    plugins: (function () {
        var config = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'dp-project-config.json'), 'utf8')),
            plugins = [
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
            ];
        switch (config.flag) {
            case 'profile':
                BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
                plugins = plugins.concat([
                    new BundleAnalyzerPlugin()
                ]);
            case 'dev':
                return plugins.slice(1);
            default:
                return plugins;
        }
    })(),
    node: {
        'path': true,
        'url': true
    }
};
