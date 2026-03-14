import { spawn } from "child_process";
import hugoBin from "hugo-bin";

// Builds the static pages
export default function hugo(cb, options = false) {
  const hugoArgsDefault = ["-d", "../dist", "-s", "../site"];
  // const hugoArgsPreview = ['--buildDrafts', '--buildFuture'];
  // const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;
  const args =
    options === false ? hugoArgsDefault : hugoArgsDefault.concat(options);

  return spawn(hugoBin, args, { stdio: "inherit" }).on("close", (code) => {
    if (code === 0) {
      cb();
    } else {
      cb("Hugo build failed :(");
    }
  });
}
