// Karma configuration
// Generated on Sun Sep 23 2018 16:37:18 GMT+0000 (GMT)
const external = require("rollup-plugin-peer-deps-external");
const builtIns = require("rollup-plugin-node-builtins");

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const url = require('rollup-plugin-url');
const commonjs = require('rollup-plugin-commonjs');
const pkg = require('./package.json');


module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'test/test-entry.js',
      /*'src/!**!/!*.jsx',
      'test/!**!/!*.js',
      'test/!**!/!*.jsx'*/
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/test-entry.js':  ['rollup'],/*
      'test/!**!/!*.jsx': ['rollup'],
      'src/!**!/!*.js':   ['rollup'],
      'test/!**!/!*.js':  ['rollup'],*/

    },

    rollupPreprocessor: {
      // rollup settings. See Rollup documentation
      //input: 'src/index.js',
      output: {
        name: 'Questrar',
        format: 'iife',
        sourceMap: 'inline',
        globals: pkg.externals
      },
      external: Object.keys(pkg.peerDependencies),
      plugins: [
        external(),
        resolve({
          //preferBuiltins: true,
          extensions: [ '.js', '.jsx', '.json' ],
          customResolveOptions: {
            moduleDirectory: 'node_modules'
          }
        }),
        babel({
          exclude: 'node_modules/**',
          plugins: [ 'external-helpers' ],
          presets: ['react', 'stage-0', ['env', { modules: false }] ]
        }),
        /*commonjs({
          include: 'node_modules/!**',
          namedExports: {
            'node_modules/react-is/index.js': ['isValidElementType']
          }
        }),
        url(),
        builtIns(),
        */
      ],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage'],

    coverageReporter: {
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [process.env.CI ? 'ChromeCI' : 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
