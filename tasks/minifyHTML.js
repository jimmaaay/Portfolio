const fs = require('fs');
const { promisify } = require('util');
const { minify } = require('html-minifier');
const { globHelper } = require('./helpers');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const minifyHTML = function minifyHTML(done) {

  (async () => {
    
    const matching = [
      'dist/**/*.html',
      '!dist/project/**',
    ];

    const files = await globHelper(matching);

    /**
     * Will amend one file at a time. Could use blurbirds Promise.map to add 
     * some concurrency. 
     */
    for (const fileName of files) {
      const fileContents = await readFileAsync(fileName, 'utf-8');
      const minifiedResult = minify(fileContents, {
        collapseWhitespace: true,
      });
      await writeFileAsync(fileName, minifiedResult);
    }

    if (typeof done === 'function') done();
    

  })();


};


module.exports = minifyHTML;