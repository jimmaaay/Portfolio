import { deleteAsync } from "del";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Merges the manifests from the build process and formats them
export default function manifests(done) {
  // not really sure why gulp-manifest gets put in the root directory but it does 🙃
  const gulpManifestPath = path.resolve(__dirname, "../gulp-manifest.json");
  const webpackManifestPath = path.resolve(
    __dirname,
    "../dist/webpack-manifest.json",
  );
  const gulpManifest = JSON.parse(fs.readFileSync(gulpManifestPath, "utf-8"));
  const webpackManifest = JSON.parse(
    fs.readFileSync(webpackManifestPath, "utf-8"),
  );
  const both = Object.assign({}, gulpManifest, webpackManifest);
  const newObj = {};
  for (let key in both) {
    const data = both[key];
    /**
     * Couldn't figure out how to reference items with dots in their names within Hugo
     * so changed dots to underscores. E.g main.css to main_css
     */
    newObj[path.basename(key).replace(/\./g, "_")] = path.basename(data);
  }
  fs.writeFileSync(
    path.resolve(__dirname, "../site/data/manifest.json"),
    JSON.stringify(newObj),
    "utf-8",
  );
  deleteAsync([gulpManifestPath, webpackManifestPath], { force: true })
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
}
