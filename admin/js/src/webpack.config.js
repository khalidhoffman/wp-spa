const path = require('path');

const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ModuleReplace = webpack.NormalModuleReplacementPlugin;

module.exports = {
    entry: "./app.js",
    mode: 'development',
    context: __dirname,
    output: {
        path: path.join(process.cwd(), '/admin/js/'),
        filename: "wp-spa-admin.js"
    },
    module: {
        noParse: [/jquery/, /backbone/],
        rules: [
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            "css-parser": path.join(__dirname, "./vendors/cssParser.js"),
            "jquery": path.join(__dirname, "./vendors/jquery-wp.js")
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            })
        ]
    },
    plugins: (function () {
        var config = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'weblee.config.json'), 'utf8')),
            defaults = [
                new ModuleReplace(/^css-parser$/, function (ctx) {
                    ctx.request = 'exports-loader?CSSParser!' + ctx.request;
                })
            ];

        switch (config.flag) {
            case 'dev':
                return defaults.slice(1);

            default:
                return defaults;
        }
    })(),
    node: {
        'path': true,
        'url': true
    }
};
