const glob = require('glob');
const { minify } = require('html-minifier');

const minifyHTML = function minifyHTML(done) {
  const matching = [
    'dist/**/*.html',
    '!dist/project/**',
  ];

  // Converts glob to a promise
  const globPromise = (pattern, opts = {}) => {
    return new Promise((resolve, reject) => {
      glob(pattern, opts, (err, files) => {
        if (err != null) return reject(err);
        return resolve(files);
      });
    });
  };

  // Call globPromise
  const promises = matching.map((ogPattern) => {
    const pattern = ogPattern.indexOf('!') === 0
    ? ogPattern.replace('!', '') // Remove not selector as it's only used in the next step
    : ogPattern;
    return globPromise(pattern);
  });

  Promise
    .all(promises)
    .then((res) => {
      
      const files = res.reduce((ret, array, i) => {
        const ogPattern = matching[i];

        // If is a not selector then remove the items from the array that match this
        if (ogPattern.indexOf('!') === 0) {
          return ret.filter(item =>  array.indexOf(item) === -1);
        } else {
          return ret.concat(array);
        }
      }, []);

      // TODO: minify all html files in files array


    });
};


module.exports = minifyHTML;