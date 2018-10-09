import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import { plugin as analyze } from 'rollup-plugin-analyzer';
import pkg from './package.json'
import { uglify } from 'rollup-plugin-uglify';


const peerDeps = Object.keys(pkg.peerDependencies);

const makeConfig = ({input, output, minify}) => ({
  input: 'src/index.js',
  output: {
    ...output,
    },
  external: peerDeps,
  plugins: [
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
});



export default [
  makeConfig({
    input: 'src/index.js',
    minify: true,
    output:
      {
        file: pkg.main,
        format: 'umd',
        name: 'Questrar',
        sourcemap: true
      }
  }),
  makeConfig({
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  })
];
