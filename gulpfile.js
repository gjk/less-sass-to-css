var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    browserSync=require('browser-sync'),
    del = require('del'),
    reload = require('browser-sync').reload,
    sass = require('gulp-sass'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    sassLint = require('gulp-sass-lint'),
    lessHint = require('gulp-lesshint');

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
gulp.task('sass',['sassLint'], function () {
  return gulp.src(paths.srcSass+'/**.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(paths.distSass));
});

//监听所有打包之后的文件变动，自动刷新页面
gulp.task('less',['lessLint'], function () {
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

gulp.task('lessLint', function () {
    return gulp.src('./src/*.less')
        .pipe(lessHint({
            // Options 
        }))
        // .pipe(lessHint.reporter('reporter-name')) // Leave empty to use the default, "stylish" 
        .pipe(lessHint.failOnError()); // Use this to fail the task on lint errors 
});

gulp.task('sassLint', function () {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('sassBuild', ['sass']);
gulp.task('lessBuild', ['less']);

gulp.task('default', ['runSequence']);