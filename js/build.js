({
    name: 'build-production',
    baseUrl: "./",
    optimize: 'uglify2',
    uglify2: {
        compress: {
            drop_console: true,
            drop_debugger: true
        }
    },
    waitSeconds: 0,
    include: ['require-lib'],
    mainConfigFile: 'rjs-config.js',
    out: "../public/js/wp-spa.js"
});