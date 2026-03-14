import path from "path";
import webpack from "webpack";
import { WebpackAssetsManifest } from "webpack-assets-manifest";
import TerserPlugin from "terser-webpack-plugin";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTION = process.env.NODE_ENV === "production";

export const config = {
  entry: {
    main: ["./src/js/main.js"],
  },
  output: {
    filename: PRODUCTION ? "./[name]-[hash].js" : "./js/[name].js",
    path: PRODUCTION
      ? path.resolve(__dirname, "../dist/js")
      : path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  context: path.resolve(__dirname, "../"),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  pragma: "domBuilder",
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: PRODUCTION
    ? [
        new TerserPlugin(),
        new WebpackAssetsManifest({
          output: "../webpack-manifest.json",
        }),
      ]
    : [],
};

// Bundles the JS
export const scripts = () =>
  new Promise((resolve) =>
    webpack(config, (err, stats) => {
      if (err) console.log("Webpack", err);
      console.log(stats.toString());
      resolve();
    }),
  );
