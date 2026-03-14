import gulp from "gulp";
import { join, dirname } from "path";
import StaticServer from "static-server";
import { clean } from "./clean.js";
import { scripts } from "./webpack.js";
import { server } from "./server.js";
import hugo from "./hugo.js";
import styles from "./styles.js";
import manifests from "./manifests.js";
import svgSpriter from "./svgSpriter.js";
import other from "./other.js";
import minifyHTML from "./minifyHTML.js";
import serviceWorkerScript from "./serviceWorker.js";
import injectCSS from "./injectCSS.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticServer = (done) => {
  const rootPath = join(__dirname, "../dist");
  console.log({ rootPath });

  const server = new StaticServer({
    host: "localhost",
    rootPath,
    port: 3000,
  });
  gulp.watch("./src/sw.js").on("all", serviceWorkerScript);

  server.start(() => {
    console.log(`Started server on port ${server.port}`);
    done();
  });
};

export const dev = gulp.series(
  clean,
  gulp.parallel(styles, svgSpriter, other),
  serviceWorkerScript,
  server,
);

export const build = gulp.series(
  clean,
  gulp.parallel(scripts, styles, svgSpriter, other),
  manifests,
  hugo,
  minifyHTML,
  injectCSS,
  serviceWorkerScript,
);

export const serviceWorker = gulp.series(
  clean,
  gulp.parallel(scripts, styles, svgSpriter, other),
  manifests,
  hugo,
  minifyHTML,
  injectCSS,
  serviceWorkerScript,
  staticServer,
);
