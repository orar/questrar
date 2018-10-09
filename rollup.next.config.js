import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import { plugin as analyze } from 'rollup-plugin-analyzer'
import strip from 'rollup-plugin-strip';
import stripFlow from 'rollup-plugin-flow'
import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json'


const isProduction = process.env.NODE_ENV === 'production';
const peerDeps = Object.keys(pkg.peerDependencies);


//const copyESModules = () => {};

const makeConfig = ({ input, outputs, minify }) => {

  return {
    input,
    output: {
      ...outputs,
      name: 'questrar',
      exports: 'named'
    },
    external:  peerDeps,
    plugins: [
      strip({
        debugger: isProduction,
        functions: [ 'console.log', 'assert.*', 'debug', 'alert' ],
        sourceMap: true
      }),
      external(),
      analyze({ limit: 1 }),
      postcss({
        modules: true
      }),
      url(),
      babel({
        exclude: 'node_modules/**',
        plugins: [ 'external-helpers' ]
      }),
      resolve({
        extensions: [ '.js', '.jsx', '.json' ],
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      commonjs(),
      minify && uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      })
    ]
  };
};



const inputs = {
  main: 'src/index.js',
  redux: 'providers/redux/index.js'
  //mobx: 'providers/mobx/index.js'
};


export default [
  makeConfig({
    inputs,
    outputs: {
      dir: 'dist',
      format: 'umd',
      entryFileNames: 'questrar-[name].[format].js'
    }
  }),
  makeConfig({
    inputs,
    outputs: {
      dir: 'es',
      format: 'esm',
      entryFileNames: 'questrar.-[name].[format].js'
    }}),
];
