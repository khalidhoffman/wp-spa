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
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }),

        //new webpack.ProvidePlugin({
        //  $: "jquery",
        //  jQuery: "jquery",
        //  "window.jQuery": "jquery"
        //}),

        // Hack for requirejs's css plugin
        new ModuleReplace(/^css-parser$/, function (ctx) {
            ctx.request = 'exports?CSSParser!' + ctx.request;
        })
    ],
    node: {
        'path': true,
        'url': true
    }
};
