const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

/* eslint-disable global-require */
const htmlConfig = {
  title: 'Questrar',
  appMountId: 'app',
  template: require('html-webpack-template'),
};

module.exports = () => ({
  entry: 'app.jsx',
  devtool: 'inline-source-map',
  mode: process.env.NODE_ENV,

  devServer: {
    port: 3000,

  },

  output: {
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
        exclude: /node_modules/,

      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
    // Can require('file') instead of require('file.js') etc.
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin(htmlConfig),
  ],
});
