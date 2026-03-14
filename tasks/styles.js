import gulp from "gulp";
import sourcemaps from "gulp-sourcemaps";
import gulpSass from "gulp-sass";
import plumber from "gulp-plumber";
import autoprefixer from "gulp-autoprefixer";
import gulpIf from "gulp-if";
import rev from "gulp-rev";
import cssnano from "gulp-cssnano";
import { dirname, join } from "path";
import * as sassCompiler from "sass";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sass = gulpSass(sassCompiler);

const PRODUCTION = process.env.NODE_ENV === "production";

// Compiles SCSS to css
export default function styles() {
  return gulp
    .src(join(__dirname, "../src/scss/main.scss"))
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(gulpIf(PRODUCTION, cssnano()))
    .pipe(gulpIf(PRODUCTION, rev()))
    .pipe(sourcemaps.write("."), {
      includeContent: true,
    })
    .pipe(gulp.dest(join(__dirname, "../dist/styles")))
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
    .pipe(gulpIf(PRODUCTION, gulp.dest("dist")));
}
