const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./app.ts",
    context: __dirname,
    devtool: 'inline-source-map',
    mode: 'development',
    output: {
        path: path.join(process.cwd(), 'public/js/'),
        filename: "wp-spa-public.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            "utils": path.join(__dirname, "./modules/lib/utils"),
            "modules": path.join(__dirname, './modules'),

            // overrides
            "jquery": path.join(__dirname, "./vendors/jquery-wp.js")
        }
    },
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             sourceMap: true,
    //             uglifyOptions: {
    //                 compress: {
    //                     drop_console: true,
    //                     drop_debugger: true
    //                 }
    //             }
    //         })
    //     ]
    // },
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

            default:
                return plugins
        }
    })(),
    node: {
        'path': true,
        'url': true
    }
};
