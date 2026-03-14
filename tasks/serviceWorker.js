import { readFile, writeFile } from "node:fs/promises";
import crypto from "crypto";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { globHelper } from "./helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function serviceWorker(done) {
  if (process.env.NODE_ENV === "development") {
    // Add a blank service worker when running the site on localhost
    await writeFile(join(__dirname, "../dist/sw.js"), "");
  } else {
    // Files to get
    const patterns = [
      "../dist/partials/index.html",
      "../dist/partials/offline/index.html",
      "../dist/template/index.html",
      "../dist/js/**/*.js",
      "../dist/styles/**/*.css",
      "../dist/img/svgSprites/**/*.svg",
      "../dist/other/fonts/**/*.woff2",
      "../dist/portfolio/index.json",
    ];
    const fileNames = await globHelper(patterns);
    const newFileNames = fileNames.map((fileName) =>
      fileName.replace("./dist", "").replace("index.html", ""),
    );
    const hash = crypto.createHash("md5");

    fileNames.forEach((fileName) => {
      hash.update(fileName);
    });

    const cacheName = hash.digest("hex");
    const variables = JSON.stringify({
      cacheName,
      files: newFileNames,
    });

    // get the service worker template
    const swTemlpate = await readFile(join(__dirname, "../src/sw.js"));

    await writeFile(
      join(__dirname, "../dist/sw.js"),
      `
      var variables = ${variables};
      ${swTemlpate}
    `,
    );
  }

  if (typeof done === "function") done();
}
