var path = require('path'),
    url = require('url'),
    fs = require('fs'),

    webpack = require('webpack');

module.exports = {
    entry: "app.js",
    context: __dirname,
    devtool: 'inline-source-map',
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
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /^history/,
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
        const configPath = path.join(process.cwd(), 'weblee.config.json');
        const configText = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configText);
        const plugins = [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            })
        ];

        switch (config.flag) {
            case 'profile':
                const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
                return plugins.concat([new BundleAnalyzerPlugin(), MinifyPlugin]);

            case 'dev':
                return plugins;

            default:
                const MinifyPlugin = new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                });

                return plugins.concat(MinifyPlugin);
        }
    })(),
    node: {
        'path': true,
        'url': true
    }
};
