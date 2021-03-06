const del = require('del');
const path = require('path');
const fs = require('fs');

// Merges the manifests from the build process and formats them
const manifests = function manifests (done) {
  // not really sure why gulp-manifest gets put in the root directory but it does 🙃
  const gulpManifestPath = path.resolve(__dirname, '../gulp-manifest.json');
  const webpackManifestPath = path.resolve(__dirname, '../dist/webpack-manifest.json');
  const gulpManifest = require(gulpManifestPath);
  const webpackManifest = require(webpackManifestPath);
  const both = Object.assign({}, gulpManifest, webpackManifest);
  const newObj = {};
  for (let key in both) {
    const data = both[key];
    /**
     * Couldn't figure out how to reference items with dots in their names within Hugo
     * so changed dots to underscores. E.g main.css to main_css
     */
    newObj[path.basename(key).replace(/\./g, '_')] = path.basename(data);
  };
  fs.writeFileSync(path.resolve(__dirname, '../site/data/manifest.json'), JSON.stringify(newObj), 'utf-8');
  del([gulpManifestPath, webpackManifestPath])
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = manifests;