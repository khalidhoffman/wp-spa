var require = require.config({
    baseUrl: '/celebrationtt/wp-content/plugins/wp-spa/js',
    waitSeconds: 0,
    namespace: 'wp_spa',
    config: {
        rootPath: '/celebrationtt'
    },
    paths: {
        "build-production": "app-prod",
        "require-lib": "vendors/require",
        "domReady": "vendors/domReady",
        "text": "vendors/text",
        "flexslider": "vendors/jquery.flexslider-custom",
        "underscore": "vendors/lodash.min",
        "backbone": "vendors/backbone",
        "live": "vendors/live",
        "modernizr": "vendors/modernizr-custom",
        "lightbox": "vendors/lightbox.min",
        "videojs": "vendors/video.min",
        "jquery": "vendors/jquery",
        "jquery-ui": "vendors/jquery-ui.min",
        "lazyload": "vendors/jquery.lazyload",
        "masonry": "vendors/masonry.pkgd.min",
        "masonry-imagesloaded": "vendors/imagesloaded",
        "jquery-noconflict": "vendors/jquery-noconflict",
        "jquery-masonry": "vendors/masonry-custom",
        "jquery-copycss": "vendors/jquery.copycss",
        "angular": "vendors/development/angular",
        "angular-animate": "vendors/development/angular-animate",
        "angular-aria": "vendors/development/angular-aria",
        "angular-route": "vendors/development/angular-route",
        "angular-sanitize": "vendors/development/angular-sanitize",
        "diff": "../node_modules/diff/dist/diff",
        "diff-dom": "../node_modules/diff-dom/diffDOM",
        "utils": "modules/utils",
        "path": "vendors/path",
        "ng-app": "modules/ng-app",
        "directives": "modules/directives/index",
        "controllers": "modules/controllers/index",
        "ng-router": "modules/router",
        "wordpress": "modules/models/wordpress",
        "dp-animate": "modules/views/widgets/jquery.dp-animate",
        "sass": "//192.168.1.119/v7/src/vendors/sass",
        "sass-worker": "//192.168.1.119/v7/src/vendors/sass.worker",
        "sass-sync": "//192.168.1.119/v7/src/vendors/sass.sync",
        "jasmine": "/jasmine/lib/jasmine-2.3.4/jasmine",
        "jasmine-core": "/jasmine/lib/jasmine-2.3.4/jasmine-html",
        "jasmine-boot": "/jasmine/lib/jasmine-2.3.4/boot",
        "jasmine-jquery": "/jasmine/lib/jasmine-2.3.4/jasmine-jquery",
        "test-utils": "tests/test-utils"
    },
    map: {
        // '*' means all modules will get 'jquery-private'
        // for their 'jquery' dependency.
        '*': {'jquery': 'jquery-noconflict'},
        // 'jquery-private' wants the real jQuery module
        // though. If this line was not here, there would
        // be an unresolvable cyclic dependency.
        'jquery-noconflict': {'jquery': 'jquery'}
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "live": [],
        "videojs": [],
        "diff-dom": {
            exports: 'diffDOM'
        },
        "jquery-noconflict": {
            "deps": ["jquery"]
        },
        "jquery-ui": {
            "deps": ["jquery"]
        },
        "jquery-copycss": {
            "deps": ["jquery"]
        },
        "lazyload": {
            deps: ["jquery"]
        },
        "flexslider": {
            "deps": ["jquery"]
        },
        "masonry": {
            deps: ["jquery"]
        },
        "lightbox": {
            "deps": ["jquery"]
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        "sass-worker": ['sass'],
        "angular": {
            exports: 'angular',
            deps: ["jquery"]
        },
        "angular-animate": ["angular"],
        "angular-route": ["angular"],
        "angular-aria": ["angular"],
        "angular-sanitize": ["angular"],
        "jasmine": [],
        "jasmine-core": {
            "deps": ["jasmine"]
        },
        "jasmine-boot": {
            "deps": ["jasmine-core"]
        },
        "jasmine-jquery": {
            "deps": ["jasmine-boot"]
        }
    }
});
