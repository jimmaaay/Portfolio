const fs = require('fs');

const copyRedirects = function copyRedirects(done) {
  fs.createReadStream('./_redirects')
    .pipe(fs.createWriteStream('dist/_redirects'))
    .on('finish', done);
};

module.exports = copyRedirects;