const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const rev = require('gulp-rev');
const cssnano = require('gulp-cssnano');
const path = require('path');

const PRODUCTION = process.env.NODE_ENV === 'production';

const styles = function styles() {
  return gulp.src('./src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',  sass.logError))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(gulpIf(PRODUCTION, cssnano()))
    .pipe(gulpIf(PRODUCTION, rev()))
    .pipe(sourcemaps.write('.'),{
      includeContent: true,
    })
    .pipe(gulp.dest('dist/styles'))
    .pipe(gulpIf(PRODUCTION,rev.manifest({
      base: 'dist',
      path: 'gulp-manifest.json',
      merge: true,
    })))
    .pipe(gulpIf(PRODUCTION, gulp.dest('dist')));
};

module.exports = styles;
