const { spawn } = require('child_process');
const hugoBin = require('hugo-bin');

// Builds the static pages
module.exports = (cb, options = false) => {
  const hugoArgsDefault = ['-d', '../dist', '-s', 'site', '-v'];
  // const hugoArgsPreview = ['--buildDrafts', '--buildFuture'];
  // const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;
  const args = options === false ? hugoArgsDefault : hugoArgsDefault.concat(options);

  return spawn(hugoBin, args, {stdio: 'inherit'}).on('close', (code) => {
    if (code === 0) {
      cb();
    } else {
      cb('Hugo build failed :(');
    }
  });
};


