var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    browserSync=require('browser-sync'),
    del = require('del'),
    reload = require('browser-sync').reload,
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    livereload = require('gulp-livereload');

var paths = {
    src: "./src",
    dist: "./dist",
    srcLess: "./src/less",
    srcSass: "./src/sass",
    distLess: "./dist/less",
    distSass: "./dist/sass"
};


//注册browserSync
gulp.task('browserSync', function() {
    browserSync.init({
        server: [paths.dist]
    });

    //修改sass，刷新页面
    var watchSass = gulp.watch([paths.srcSass + '/**.scss'], ['sass', reload]);
    var watchLess = gulp.watch([paths.srcLess + '/**.less'], ['less', reload]);
});

//监听所有打包之后的文件变动，自动刷新页面
gulp.task('sass', function () {
  return gulp.src(paths.srcSass+'/**.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(paths.distSass));
});

//监听所有打包之后的文件变动，自动刷新页面
gulp.task('less', function () {
    return gulp.src(paths.srcLess+'/**.less')
        .pipe(less())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(paths.distLess));
});

//并发
gulp.task('runSequence', function() {
    return runSequence(['clean'], ['sass','less'], ['browserSync']);
});

//清空生成目录
gulp.task('clean', function() {
    return del(
        [paths.dist]
    );
});

gulp.task('sassBuild', ['sass']);
gulp.task('lessBuild', ['less']);

gulp.task('default', ['runSequence']);