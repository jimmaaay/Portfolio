import gulp from "gulp";
import Browser from "browser-sync";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import { config as webpackConfig } from "./webpack.js";
import hugo from "./hugo.js";
import styles from "./styles.js";
import svgSpriter from "./svgSpriter.js";
import other from "./other.js";
import serviceWorker from "./serviceWorker.js";

let reload = () => {};

if (!webpackConfig.hasOwnProperty("plugins")) webpackConfig.plugins = [];

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
export const server = function server(cb) {
  const config = {
    server: "dist",
    ghostMode: false,
    middleware: [webpackDevMiddleware(bundler)],
  };

  const hugoBuild = (done) => {
    hugo((msg) => {
      if (msg != null) {
        browser.notify(msg);
      } else {
        browser.reload();
      }
      if (typeof done === "function") done();
    });
  };

  hugo(() => {
    reload = browser.reload;
    gulp.watch("site/**/*").on("all", hugoBuild);
    gulp.watch("src/scss/**/*").on("all", gulp.series(styles, reload));
    gulp.watch("src/svg/**/*.svg").on("all", gulp.series(svgSpriter, reload));
    gulp
      .watch([
        "src/other/**/*",
        "_redirects",
        "_headers",
        "src/img/**/*",
        "project/**/*",
      ])
      .on("all", gulp.series(other, reload));
    browser.init(config);
    cb();
  });
};
