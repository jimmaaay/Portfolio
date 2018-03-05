const path = require('path');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const PRODUCTION = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    main: [
      './src/js/main.js',
    ],
  },
  output: {
    filename: PRODUCTION
    ? './[name]-[hash].js'
    : './js/[name].js',
    path: PRODUCTION 
      ? path.resolve(__dirname, '../dist/js')
      : path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  context: path.resolve(__dirname, '../'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {
                pragma: 'domBuilder',
              }],
            ],
          },
        },
      },
    ],
  },
  plugins: PRODUCTION
  ? [
    new UglifyJsPlugin(),
    new WebpackAssetsManifest({
      output: '../webpack-manifest.json',
    }),
  ]
  : [],
};

// Bundles the JS
const scripts = () => (
  new Promise(resolve => webpack(config, (err, stats) => {
    if (err) console.log('Webpack', err);
    console.log(stats.toString());
    resolve();
  }))
);

module.exports = { config, scripts };