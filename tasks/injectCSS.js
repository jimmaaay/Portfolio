import { readFile, writeFile } from "node:fs/promises";
import { globHelper } from "./helpers.js";

export default async function injectCSS(done) {
  const matching = [
    "../dist/**/*.html",
    "../!dist/project/**",
    "../!dist/partials/**",
  ];

  const files = await globHelper(matching);
  const cssFileName = await globHelper(["../dist/styles/main*"]);
  const stylesheet = await readFile(cssFileName[0]);
  const styleTag = `<style>${stylesheet}</style>`;

  for (const fileName of files) {
    const fileContents = await readFile(fileName, "utf-8");
    const newContent = fileContents.replace(
      `<link rel="stylesheet" href="${cssFileName[0].replace("dist", "")}">`,
      styleTag,
    );
    await writeFile(fileName, newContent);
  }

  done();
}
