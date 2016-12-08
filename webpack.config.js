var path = require('path'),
    url = require('url'),
    fs = require('fs'),


    wpConfig = (function () {
        var config = {
            domain: '127.0.0.1',
            path: '/'
        };
        try {
            var localConfigStr = fs.readFileSync(path.resolve(__dirname, 'data/wp-spa.config.json')),
                localConfig = JSON.parse(localConfigStr),
                siteURLMeta = url.parse(localConfig.siteURL);
            config.domain = siteURLMeta.host;
            config.path = siteURLMeta.pathname;
        } catch (err) {
            console.warn(err);
        }
        return config;
    })(),
    webpack = require('webpack'),
    ModuleReplace = webpack.NormalModuleReplacementPlugin;

module.exports = {
    entry: "app.js",
    context: path.resolve(__dirname, 'public/js/src/'),
    output: {
        path: './public/js/',
        publicPath: wpConfig.path,
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
        root: path.resolve(__dirname, 'public/js/src/'),
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
