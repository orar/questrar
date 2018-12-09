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
        test: [/\.(bmp|gif|jpe?g|png)$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.(eot|ttf|svg|woff|woff2)$/],
        loader: require.resolve('file-loader'),
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',

          },
          'resolve-url-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourcemap: true,
            },
          },
        ],
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
