import { readFile, writeFile } from "node:fs/promises";
import { minify } from "html-minifier";
import { globHelper } from "./helpers.js";

export default async function minifyHTML(done) {
  const matching = ["../dist/**/*.html", "../!dist/project/**"];

  const files = await globHelper(matching);

  /**
   * Will amend one file at a time. Could use blurbirds Promise.map to add
   * some concurrency.
   */
  for (const fileName of files) {
    const fileContents = await readFile(fileName, "utf-8");
    const minifiedResult = minify(fileContents, {
      collapseWhitespace: true,
    });
    await writeFile(fileName, minifiedResult);
  }

  if (typeof done === "function") done();
}
