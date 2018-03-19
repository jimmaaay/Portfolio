const fs = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');
const { globHelper } = require('./helpers');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const serviceWorker = async function serviceWorker(done) {
  if (process.env.NODE_ENV === 'development') {
    // Add a blank service worker when running the site on localhost
    await writeFileAsync('./dist/sw.js', '');
  } else {
    // Files to get
    const patterns = [
      './dist/partials/index.html',
      './dist/partials/offline/index.html',
      './dist/template/index.html',
      './dist/js/**/*.js',
      './dist/styles/**/*.css',
      './dist/img/svgSprites/**/*.svg',
      './dist/other/fonts/**/*.woff2',
      './dist/portfolio/index.json',
    ];
    const fileNames = await globHelper(patterns);
    const newFileNames = fileNames.map(fileName => fileName.replace('./dist', '').replace('index.html', ''));
    const hash = crypto.createHash('md5');

    fileNames.forEach(fileName => {
      hash.update(fileName);
    });

    const cacheName = hash.digest('hex');
    const variables = JSON.stringify({
      cacheName,
      files: newFileNames,
    });

    // get the service worker template
    const swTemlpate = await readFileAsync('./src/sw.js');

    await writeFileAsync('./dist/sw.js', `
      var variables = ${variables};
      ${swTemlpate}
    `);
  }

  if (typeof done === 'function') done();
};


module.exports = serviceWorker;