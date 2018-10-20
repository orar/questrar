import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import { plugin as analyze } from 'rollup-plugin-analyzer';
import { uglify } from 'rollup-plugin-uglify';
import builtins from 'rollup-plugin-node-builtins';
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import pkg from './package.json'
import reduxPkg from './redux/package.json';



const peerDeps = Object.keys(pkg.externals);

const makeConfig = ({input, output, minify, dependencies}) => ({
  input,
  output: {
    ...output,
    },
  external: Array.isArray(dependencies) ? dependencies : [],
  plugins: [
    external(),

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
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType']
      }
    }),
    minify && uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
    sizeSnapshot()
  ].filter(Boolean)
});



export default [
  makeConfig({
    input: 'es/index.js',
    minify: true,
    output: {
        file: pkg.unpkg,
        format: 'umd',
        name: 'Questrar',
        sourcemap: true,
        globals: pkg.externals
      },
    dependencies: peerDeps
  }),
  makeConfig({
    input: 'es/index.js',
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'Questrar',
      sourcemap: true,
      globals: pkg.externals
    },
    dependencies: peerDeps
  }),
 makeConfig({
    input: 'es/index.js',
    output: {
      file: 'questrar-esm.js',
      dir: 'esm',
      format: 'es',
      sourcemap: true
    },
   dependencies: peerDeps
  }),
 makeConfig({
    input: 'es/redux/index.js',
    output: {
      file: 'questrar-redux-esm.js',
      dir: 'esm',
      format: 'es',
      sourcemap: true
    },
   dependencies: peerDeps
  }),
  makeConfig({
    input: 'es/redux/index.js',
    output: {
      file: "questrar-redux-cjs.js",
      dir: 'lib',
      format: 'cjs',
      sourcemap: true
    }
  })
];
