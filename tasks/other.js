import gulp from "gulp";
import { writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Copies various files to the dist directory
export default async function other(done) {
  const copyStuff = [
    {
      src: "src/other/**/*",
      dest: "dist/other",
    },
    {
      src: ["_redirects", "_headers"],
      dest: "dist",
    },
    {
      src: "src/img/**/*",
      dest: "dist/img",
    },
    {
      src: "project/**/*",
      dest: "dist/project",
    },
  ];

  await Promise.all(
    copyStuff.map(({ src, dest }) => {
      return new Promise((resolve) => {
        const newSrc = Array.isArray(src)
          ? src.map((str) => {
              return join(__dirname, `../${str}`);
            })
          : join(__dirname, `../${src}`);

        const newDest = join(__dirname, `../${dest}`);

        gulp
          .src(newSrc, { encoding: false })
          .pipe(gulp.dest(newDest))
          .on("end", () => {
            console.log("bello");
            resolve();
          });
      });
    }),
  );

  done();
}
