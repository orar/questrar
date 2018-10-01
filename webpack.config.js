const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'production';

const libraryName = 'questrar';

module.exports = () => {


  return {
    entry: './src/index.js',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    mode: process.env.NODE_ENV,

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: libraryName + '.js',
      libraryTarget: 'umd',
      library: libraryName
    },

    optimization: {
      minimizer: [new UglifyJsPlugin({
          test: /\.js(\?.*)?$/i
        })]
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'providers'),
          ],
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          include: [path.resolve(__dirname, 'src')],
          use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'providers'),
        path.resolve(__dirname, 'node_modules'),
      ],
      // Can require('file') instead of require('file.js') etc.
      extensions: ['.js', '.jsx', '.json']
    },
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      lodash: {
        root: 'Lodash',
        commonjs2: 'lodash',
        commonjs: 'lodash',
        amd: 'lodash'
      },
      'prop-types': {
        root: 'PropTypes',
        commonjs2: 'prop-types',
        commonjs: 'prop-types',
        amd: 'prop-types'
      }
    }
  }
};