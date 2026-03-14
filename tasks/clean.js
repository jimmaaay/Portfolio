import { deleteAsync } from "del";

// Deletes files which will be remade later on in the build
export const clean = function clean(done) {
  deleteAsync(["dist", "site/data/manifest.json"])
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
};
