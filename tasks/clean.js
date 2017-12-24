const del = require('del');

module.exports = function clean(done) {
  del(['dist', 'site/data/manifest.json'])
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
};
