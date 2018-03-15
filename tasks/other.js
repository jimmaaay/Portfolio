const gulp = require('gulp');

// Copies various files to the dist directory
module.exports = function other(done) {
  const copyStuff = [
    {
      src: 'src/other/**/*',
      dest: 'dist/other',
    },
    {
      src: [
        '_redirects',
        '_headers',
      ],
      dest: 'dist',
    },
    {
      src: 'src/img/**/*',
      dest: 'dist/img',
    },
    {
      src: 'project/**/*',
      dest: 'dist/project'
    }
  ];

  Promise.all(
    copyStuff.map(({ src, dest }) => {
      return new Promise((resolve) => {
        gulp
          .src(src)
          .pipe(gulp.dest(dest))
          .on('end', resolve);
      });
    })
  ).then(_ => done());

};