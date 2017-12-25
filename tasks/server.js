const gulp = require('gulp');
const Browser = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const { config:webpackConfig } = require('./webpack');
const hugo = require('./hugo');
const styles = require('./styles');
const svgSpriter = require('./svgSpriter');
const images = require('./images');

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
      done();
    });
  };

  hugo(() => {
    reload = browser.reload;
    gulp.watch('site/**/*', hugoBuild);
    gulp.watch('src/scss/**/*', gulp.series(styles, reload));
    gulp.watch('src/svg/**/*.svg', gulp.series(svgSpriter, reload));
    gulp.watch('src/img/**/*', gulp.series(images, reload));
    browser.init(config);
    cb();
  });

};