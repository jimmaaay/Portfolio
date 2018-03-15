const gulp = require('gulp');
const StaticServer = require('static-server');
const clean = require('./clean');
const { scripts } = require('./webpack');
const { server } = require('./server');
const hugo = require('./hugo');
const styles = require('./styles');
const manifests = require('./manifests');
const svgSpriter = require('./svgSpriter');
const other = require('./other');
const minifyHTML = require('./minifyHTML');
const serviceWorker = require('./serviceWorker');

const staticServer = (done) => {
  const server = new StaticServer({
    host: 'localhost',
    rootPath: './dist',
    port: 3000,
  });
  gulp.watch('./src/sw.js').on('all', serviceWorker);

  server.start(() => {
    console.log(`Started server on port ${server.port}`);
    done();
  });

};


module.exports.dev = gulp.series(
  clean,
  gulp.parallel(styles, svgSpriter, other),
  serviceWorker,
  server
);

module.exports.build = gulp.series(
  clean, 
  gulp.parallel(scripts, styles, svgSpriter, other),
  manifests,
  hugo,
  minifyHTML,
  serviceWorker
);

module.exports.serviceWorker = gulp.series(
  clean, 
  gulp.parallel(scripts, styles, svgSpriter, other),
  manifests,
  hugo,
  minifyHTML,
  serviceWorker,
  staticServer,
);
