const fs = require('fs');
const { promisify } = require('util');
const { globHelper } = require('./helpers');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

module.exports = (done) => {

  (async () => {

    const matching = [
      'dist/**/*.html',
      '!dist/project/**',
      '!dist/partials/**',
    ];

    const files = await globHelper(matching);
    const cssFileName = await globHelper(['dist/styles/main*']);
    const stylesheet = await readFileAsync(cssFileName[0]);
    const styleTag = `<style>${stylesheet}</style>`;

    console.log(`<link rel="stylesheet" href="${cssFileName[0].replace('dist', '')}">`);

    for (const fileName of files) {
      const fileContents = await readFileAsync(fileName, 'utf-8');
      const newContent = fileContents.replace(`<link rel="stylesheet" href="${cssFileName[0].replace('dist', '')}">`, styleTag);
      await writeFileAsync(fileName, newContent);
    }

    done();

  })();


};