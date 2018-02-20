const gulp = require('gulp');
const clean = require('./clean');
const { scripts } = require('./webpack');
const { server } = require('./server');
const hugo = require('./hugo');
const styles = require('./styles');
const manifests = require('./manifests');
const svgSpriter = require('./svgSpriter');
const images = require('./images');
const other = require('./other');
const minifyHTML = require('./minifyHTML');

module.exports.dev = gulp.series(
  clean,
  gulp.parallel(styles, svgSpriter, images, other),
  server
);

module.exports.build = gulp.series(
  clean, 
  gulp.parallel(scripts, styles, svgSpriter, images, other),
  manifests,
  hugo,
  minifyHTML
);