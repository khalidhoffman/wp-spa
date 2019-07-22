var path = require('path'),
    url = require('url'),
    fs = require('fs'),

    webpack = require('webpack'),
    ModuleReplace = webpack.NormalModuleReplacementPlugin;

module.exports = {
    entry: "app.js",
    context: __dirname,
    output: {
        path: path.join(process.cwd(), '/admin/js/'),
        filename: "wp-spa-admin.js"
    },
    module: {
        noParse: ['jquery', 'backbone'],
        loaders: [
            {
                test: /\.md$/,
                loader: 'raw!'
            }
        ]
    },
    resolve: {
        root: __dirname,
        modulesDirectories: [__dirname, path.join(process.cwd(), 'node_modules')],
        extensions: ['', '.js'],
        alias: {
            "css-parser": "vendors/cssParser",
            "jquery": "vendors/jquery-wp"
        }
    },
    shim: {
        "live": [],
        'modernizr': {
            "exports": 'Modernizr'
        }
    },
    plugins: (function () {
        var config = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'weblee.config.json'), 'utf8')),
            defaults = [
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }),
                new ModuleReplace(/^css-parser$/, function (ctx) {
                    ctx.request = 'exports?CSSParser!' + ctx.request;
                })
            ];
        switch (config.flag) {
            case 'dev':
                return defaults.slice(1);
                break;
            default:
                return defaults;
        }
    })(),
    node: {
        'path': true,
        'url': true
    }
};
