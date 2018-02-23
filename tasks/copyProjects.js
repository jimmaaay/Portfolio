const fs = require('fs');
const { ncp } = require('ncp');


ncp.limit = 32;

const copyProjects = function copyProjects(done) {
  fs.mkdirSync('./dist/project');
  ncp('./project', './dist/project', (err) => {
    if (err) return console.error(err);
    done();
  });
};

module.exports = copyProjects;