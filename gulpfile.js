
'use strict';

var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps');

var concatScripts = (done) => {
  return gulp.src([
      'js/global.js',
      'js/circle/autogrow.js',
      'js/circle/circle.js'
      ])
      .pipe(maps.init())
      .pipe(concat('app.js'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('js'));
  done();
}

var minifyScripts = (done) => {
  return gulp.src('js/app.js')
      .pipe(uglify())
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('js'));
  done();
}

var compileSass = (done) => {
  return gulp.src('sass/global.scss')
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('css'));
  done();
}

gulp.task("concat",concatScripts);
gulp.task("minify",minifyScripts);
gulp.task("compile",compileSass);
gulp.task("default",gulp.series(['concat','minify','compile']));
