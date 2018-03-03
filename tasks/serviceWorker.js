const fs = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');
const { globHelper } = require('./helpers');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const serviceWorker = async function serviceWorker(done) {
  if (process.env.NODE_ENV === 'developement') {
    // Add a blank service worker when running the site on localhost
    await writeFileAsync('./dist/sw.js', '');
  } else {
    const patterns = [
      './dist/index.html',
      './dist/js/**/*.js',
      './dist/styles/**/*.css',
      './dist/img/svgSprites/**/*.svg',
    ];
    const fileNames = await globHelper(patterns);
    const newFileNames = fileNames.map(fileName => fileName.replace('./dist', ''));
    const hash = crypto.createHash('md5');

    for (const fileName of fileNames) {
      const fileContents = await readFileAsync(fileName, 'utf-8');
      hash.update(fileContents);
    }

    const cacheName = hash.digest('hex');
    const variables = JSON.stringify({
      cacheName,
      files: newFileNames,
    });

    const swTemlpate = await readFileAsync('./src/sw.js');

    await writeFileAsync('./dist/sw.js', `
      var variables = ${variables};
      ${swTemlpate}
    `);
  }

  if (typeof done === 'function') done();
};


module.exports = serviceWorker;