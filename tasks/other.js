const gulp = require('gulp');

// Copies images to dist
//  Not doing image optimisations here, as it would slow down netlify deploys.
module.exports = function other(done) {
  return gulp.src('src/other/**/*')
    .pipe(gulp.dest('./dist/other'));
};