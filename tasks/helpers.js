import { promisify } from "util";
import { glob } from "glob";

const globAsync = glob;

// const globAsync = promisify(glob);

// Returns fileNames that match an array of glob selectors
export const globHelper = async (patterns) => {
  const promises = patterns.map((ogPattern) => {
    const pattern =
      ogPattern.indexOf("!") === 0
        ? ogPattern.replace("!", "") // Remove not selector as it's only used in the next step
        : ogPattern;
    return globAsync(pattern);
  });

  const res = await Promise.all(promises);

  return res.reduce((ret, array, i) => {
    const ogPattern = patterns[i];

    // If is a not selector then remove the items from the array that match this
    if (ogPattern.indexOf("!") === 0) {
      return ret.filter((item) => array.indexOf(item) === -1);
    } else {
      return ret.concat(array);
    }
  }, []);
};
