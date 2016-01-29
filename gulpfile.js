var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    server = require('http').createServer(),
    glob = require('glob'),
    io = require('socket.io')(server),
    gulp = require('gulp'),
    customJade = require('jade'),
    jade = require('gulp-jade'),
    _ = require('lodash'),
    argv = require('yargs').argv,
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    request = require('request'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    libsass = require('node-sass'),
    through2 = require('through2'),
    beautifyJS = require('js-beautify'),
    compass = require('gulp-compass'),
    projectDirectory = path.resolve(__dirname, './'),
    projectJSPath = path.resolve(projectDirectory, 'js/');

customJade.filters.php = function (text) {
    return '<?php ' + text + ' ?>';
};

gulp.task('jade-js', function () {
    var jadeJSDirectory = path.resolve(projectDirectory, './'),
        jadeJSGlob = path.join(jadeJSDirectory, '/**/[^_]*.jade');
    gulp.src(jadeJSGlob)
        .pipe(jade({
            pretty: (argv['pretty']) ? true : false,
            doctype: 'html',
            jade: customJade
        }))
        .on('error', onError)
        .pipe(gulp.dest('./public/'));
    //console.log('Saved php files from '+jadeFilesPattern + ' to '+saveDirectory);
});

gulp.task('jade-js-auto', function () {
    var jadeJSDirectory = path.resolve(projectDirectory, 'js/');
    gulp.watch(path.join(jadeJSDirectory, '/**/*.jade'), ['jade-js']);
});

gulp.task('jade-ng', function () {
    var jadeDirectory = path.resolve(projectDirectory, 'jade/'),
        jadePHPGlob = path.join(jadeDirectory, '/**/ng-*.jade');
    gulp.src(jadePHPGlob)
        .pipe(jade({
            pretty: (argv['pretty']) ? true : false,
            jade: customJade
        }))
        .on('error', onError)
        .pipe(rename({
            extname: ".php"
        }))
        .pipe(gulp.dest('./public'));
    //console.log('Saved php files from '+jadeFilesPattern + ' to '+saveDirectory);
});

gulp.task('jade-php-debug', function () {
    var jadeDirectory = path.resolve(projectDirectory, 'jade/'),
        jadeFilesPattern = path.join(jadeDirectory, '/**/[^_]*.jade');
    console.log('Jade: %j', customJade);
    gulp.src(jadeFilesPattern)
        .pipe(through2.obj({allowHalfOpen: false},
            function (file, encoding, done) {

                //console.log('chunk.path: %j', chunk.path);
                var html = customJade.render(file.contents.toString(), {
                    filename: file.path,
                    pretty: (argv['pretty']) ? true : false
                });
                //console.log('html: %s', html);
                file.contents = new Buffer(html, encoding);
                done(null, file); // note we can use the second argument on the callback
                // to provide data as an alternative to this.push('wut?')
            }
        ))
        .on('error', onError)
        .pipe(rename({
            extname: ".php"
        }))
        .pipe(gulp.dest(projectDirectory));
    //console.log('Saved php files from '+jadeFilesPattern + ' to '+saveDirectory);
});

gulp.task('jade-php-auto', function () {
    var jadeDirectory = path.resolve(projectDirectory, 'jade/');
    gulp.watch(path.join(jadeDirectory, '/**/*.jade'), ['jade-php']);
});

gulp.task('auto', function () {
    var jadePHPDirectory = path.resolve(projectDirectory, 'jade/'),
        jadeJSDirectory = path.resolve(projectDirectory, 'js/'),
        cssConfigPath = path.resolve(projectDirectory, 'stylesheets/config.css'),
        sassDirectory = path.resolve(projectDirectory, 'sass/');

    //gulp.watch(path.join(jadePHPDirectory, '/**/*.jade'), ['jade-php']);
    gulp.watch(path.join(jadeJSDirectory, '/**/*.jade'), ['jade-ng']);
    //gulp.watch(path.join(sassDirectory, '/**/*.scss'), ['sass']);
    //gulp.watch(cssConfigPath, ['build-json']);
});

gulp.task('beautify-js', function () {
    var writePath = './',
        watchPath = path.join(projectJSPath, '/!(vendors)/**/*.js');

    console.log('Search %s for javascript files', watchPath);
    gulp.src(watchPath)
        .pipe(through2.obj({
                allowHalfOpen: false
            },
            function (file, encoding, done) {
                console.log('reading: %s', file.path);
                if (file && file.contents) {

                    var jsContent = beautifyJS(file.contents.toString());
                    writePath = file.path;
                    //console.log('js: %s', jsContent);
                    file.contents = new Buffer(jsContent, encoding);
                }
                done(null, file); // note we can use the second argument on the callback
                // to provide data as an alternative to this.push('wut?')
            }
        ))
        .on('error', console.error)
        .pipe(gulp.dest(writePath));
});

gulp.task('beautify-js-auto', function () {
    var writePath = './',
        watchPath = path.join(projectJSPath, '/!(vendors)/**/*.js');

    console.log('Search %s for javascript files', watchPath);
    gulp.watch(watchPath, function (event) {

        if (event.type == 'changed') {

            fs.readFile(event.path, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                }
                console.log('updating %s', event.path);
                fs.writeFileSync(event.path, beautifyJS(data));
            });
        }
    })
});

gulp.task('test-js', function () {
    exec('jasmine', function (err, stdout, stderr) {
        console.log('results:\n %s\nerror:\n%s', stdout, stderr);
    });
});

gulp.task('build-js', function () {

    var rjsCmd = (require('os').platform() == 'linux') ? 'r.js' : 'r.js.cmd';
    exec(rjsCmd + ' -o js/build.js', function (err, stdout, stderr) {
        console.log('err:\n%s\n\nresults:\n%s\n\nstderr:\n%s', err, stdout, stderr);
    })
});


function onError(err) {
    console.log(err);
    this.emit('end');
}
