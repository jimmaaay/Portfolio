const gulp = require('gulp');

// Copies images to dist
//  Not doing image optimisations here, as it would slow down netlify deploys.
module.exports = function images(done) {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('./dist/img'));
};