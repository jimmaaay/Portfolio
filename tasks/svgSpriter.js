const fs = require('fs');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const svgSprites = require('gulp-svg-sprite');
const gulpIf = require('gulp-if');
const rev = require('gulp-rev');
const path = require('path');

const PRODUCTION = process.env.NODE_ENV === 'production';

const svgSpriter = function SVGSPRITES(done) {
  const possibleDirectories = fs.readdirSync('src/svg');
  const directories = possibleDirectories.filter(path => fs.lstatSync(`src/svg/${path}`).isDirectory());
  let completed = 0;

  if (directories.length === 0) done();

  directories.forEach((dir, i) => {
    gulp.src(`src/svg/${dir}/*.svg`)
      .pipe(plumber())
      .pipe(svgSprites({
        mode:{
          symbol:{
            dest:'dist/img/svgSprites',
            sprite:`${dir}.svg`,
          }
        },
        shape:{
          transform:[
            {
              svgo:{
                plugins:[
                  {
                    convertStyleToAttrs: false,
                  },
                ],
              }
            },
          ],
          meta:`src/svg/${dir}/description.yaml`,
        }
      }))
      .pipe(rev())
      .pipe(gulp.dest(path.resolve(__dirname, '../')))
      .pipe(rev.manifest({
        base: 'dist',
        path: 'gulp-manifest.json',
        merge: true,
      }))
      .pipe(gulp.dest(path.resolve(__dirname, '../dist')))
      .on('finish', () => {
        completed++;
        if (completed === directories.length) {
          done();
        }
      });
  });
};


module.exports = svgSpriter;