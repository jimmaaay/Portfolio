const gulp = require('gulp');
const Browser = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const { config:webpackConfig } = require('./webpack');
const hugo = require('./hugo');
const styles = require('./styles');
const svgSpriter = require('./svgSpriter');
const images = require('./images');
const other = require('./other');

let reload = () => {};

if (! webpackConfig.hasOwnProperty('plugins')) webpackConfig.plugins = [];

// Easy way of refreshing the page on completion of js bundle
const progressHook = new webpack.ProgressPlugin((percentage, msg) => {
  if (percentage === 1) {
    reload();
  }
});

webpackConfig.plugins.push(progressHook);

const browser = Browser.create();
const bundler = webpack(webpackConfig);

// Runs a browser sync server
module.exports.server = function server(cb) {

  const config = {
    server: 'dist',
    ghostMode: false,
    middleware: [
      webpackDevMiddleware(bundler),
    ],
  };

  const hugoBuild = (done) => {
    hugo((msg) => {
      if (msg != null) {
        browser.notify(msg);
      } else {
        browser.reload();
      }
      if (typeof done === 'function') done();
    });
  };

  hugo(() => {
    reload = browser.reload;
    gulp.watch('site/**/*').on('all', hugoBuild);
    gulp.watch('src/scss/**/*').on('all', gulp.series(styles, reload));
    gulp.watch('src/svg/**/*.svg').on('all', gulp.series(svgSpriter, reload));
    gulp.watch('src/img/**/*').on('all', gulp.series(images, reload));
    gulp.watch('src/other/**/*').on('all', gulp.series(other, reload));
    browser.init(config);
    cb();
  });

};