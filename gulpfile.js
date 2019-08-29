
'use strict';

var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
  imagemin = require('gulp-imagemin'),
       del = require('del'),
   connect = require('gulp-connect');

var concatScripts = (done) => {
  return gulp.src([
      'js/global.js',
      'js/circle/*.js'
      ])
      .pipe(concat('all.js'))
      .pipe(gulp.dest('js'));
  done();
}

var compileSass = (done) => {
  return gulp.src('sass/global.scss')
      .pipe(maps.init())
      .pipe(sass({outputStyle:'compressed'}))
      .pipe(rename({suffix:'.min'}))
      .pipe(maps.write('.'))
      .pipe(gulp.dest('dist/styles'))
      .pipe(connect.reload());
  done();
}

var minifyScripts = (done) => {
  return gulp.src('js/all.js')
      .pipe(maps.init())
      .pipe(uglify())
      .pipe(rename({suffix:'.min'}))
      .pipe(maps.write('.'))
      .pipe(gulp.dest('dist/scripts'))
      .pipe(connect.reload());
  done();
}

var squashImages = (done) => {
  return gulp.src('images/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/content'))
      .pipe(connect.reload());
  done();
}

var cleanFiles = (done) => {
  return del(['dist','css','js/all.js']);
  done();
}

var copyIcons = (done) => {
  return gulp.src('icons/*')
      .pipe(gulp.dest('dist/icons'))
      .pipe(connect.reload());
  done();
}

var copyIndex = (done) => {
  return gulp.src('index.html')
      .pipe(gulp.dest('dist'))
      .pipe(connect.reload());
  done();
}

var watchFiles = (done) => {
  gulp.watch('index.html',copyIndex);
  gulp.watch('images/*',squashImages);
  gulp.watch('sass/*',compileSass);
  gulp.watch([
    'js/global.js',
    'js/circle/*'],
    gulp.series(['concat','minify']));
  done();
}

var startServer = (done) => {
  connect.server({
    root: 'dist',
    port: 3000,
    livereload: true
  });
  done();
}

gulp.task("clean",cleanFiles);
gulp.task("concat",concatScripts);
gulp.task("styles",compileSass);
gulp.task("minify",minifyScripts);
gulp.task("images",squashImages);
gulp.task("copy",copyIcons);
gulp.task("index",copyIndex);
gulp.task("watch",watchFiles);
gulp.task("server",startServer);
gulp.task("scripts",gulp.series(['concat','minify']));
gulp.task("build",gulp.series(['clean','scripts','styles','images','copy','index','watch']));
gulp.task("default",gulp.series(['build','server']));
