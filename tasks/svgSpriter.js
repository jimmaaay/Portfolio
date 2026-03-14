import fs from "fs";
import gulp from "gulp";
import plumber from "gulp-plumber";
import svgSprites from "gulp-svg-sprite";
import gulpIf from "gulp-if";
import rev from "gulp-rev";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRODUCTION = process.env.NODE_ENV === "production";

// Creates svg sprite sheets
export default function SVGSPRITES(done) {
  const possibleDirectories = fs.readdirSync(join(__dirname, "../src/svg"));
  const directories = possibleDirectories.filter((path) =>
    fs.lstatSync(join(__dirname, `../src/svg/${path}`)).isDirectory(),
  );
  let completed = 0;

  if (directories.length === 0) done();

  directories.forEach((dir, i) => {
    gulp
      .src(join(__dirname, `../src/svg/${dir}/*.svg`))
      .pipe(plumber())
      .pipe(
        svgSprites({
          mode: {
            symbol: {
              dest: "dist/img/svgSprites",
              sprite: `${dir}.svg`,
            },
          },
          shape: {
            transform: [
              {
                svgo: {
                  plugins: [
                    {
                      name: "preset-default",
                      convertStyleToAttrs: false,
                    },
                  ],
                },
              },
            ],
            meta: join(__dirname, `../src/svg/${dir}/description.yaml`),
          },
        }),
      )
      .pipe(gulpIf(PRODUCTION, rev()))
      .pipe(gulp.dest(resolve(__dirname, "../")))
      .pipe(
        gulpIf(
          PRODUCTION,
          rev.manifest({
            base: "dist",
            path: "gulp-manifest.json",
            merge: true,
          }),
        ),
      )
      .pipe(gulpIf(PRODUCTION, gulp.dest(resolve(__dirname, "../dist"))))
      .on("finish", () => {
        completed++;
        if (completed === directories.length) {
          done();
        }
      });
  });
}
