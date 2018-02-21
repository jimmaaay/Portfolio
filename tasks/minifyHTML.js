const fs = require('fs');
const { promisify } = require('util');
const glob = require('glob');
const { minify } = require('html-minifier');

const globAsync = promisify(glob);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const minifyHTML = function minifyHTML(done) {
  const matching = [
    'dist/**/*.html',
    '!dist/project/**',
  ];

  const promises = matching.map((ogPattern) => {
    const pattern = ogPattern.indexOf('!') === 0
    ? ogPattern.replace('!', '') // Remove not selector as it's only used in the next step
    : ogPattern;
    return globAsync(pattern);
  });

  (async () => {
    const res = await Promise.all(promises);

    const files = res.reduce((ret, array, i) => {
      const ogPattern = matching[i];

      // If is a not selector then remove the items from the array that match this
      if (ogPattern.indexOf('!') === 0) {
        return ret.filter(item =>  array.indexOf(item) === -1);
      } else {
        return ret.concat(array);
      }
    }, []);

    /**
     * Will amend one file at a time. Could use blurbirds Promise.map to add 
     * some concurrency. 
     */
    for (const fileName of files) {
      const fileContents = await readFileAsync(fileName, 'utf-8');
      const minifiedResult = minify(fileContents, {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
      });
      await writeFileAsync(fileName, minifiedResult);
    }

    if (typeof done === 'function') done();
    

  })();


};


module.exports = minifyHTML;