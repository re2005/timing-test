var gulp = require('gulp'),
    babel = require("gulp-babel"),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    resources = {
        html: 'src/**/*.html',
        js: 'src/js/*.js',
    };

// define tasks here
gulp.task('babel', function() {
    return gulp.src("src/js/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"));
});

gulp.task('vendor', function() {
    return gulp.src("src/vendor/*.js")
        .pipe(gulp.dest("dist"));
});

gulp.task('html', function() {
    return gulp.src(resources.html)
        .pipe(gulp.dest('dist'));
});

gulp.task('build', function(cb) {
    runSequence('jslint', 'html', 'babel', 'vendor', cb);
});

gulp.task('serve', ['build'], function() {
    runSequence('browser-sync', 'watch');
});

gulp.task('watch', function() {

    gulp.watch(resources.html, function() {
        runSequence('html', 'reload');
    });

    gulp.watch(resources.js, function() {
        runSequence('jslint', 'babel', 'reload');
    });
});


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './dist'
        },
        port: 9000,
        notify: false,
        tunnel: false,
        startPath: '/',
        browser: "none"
    });
});

gulp.task('reload', function() {
    browserSync.reload();
});


gulp.task('clean', function(cb) {
    del(['dist/**']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});


gulp.task('jslint', function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
