import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';
import image from '@rollup/plugin-image';
import styles from 'rollup-plugin-styles';
import json from '@rollup/plugin-json';
//import url from '@rollup/plugin-url';
// import url from 'rollup-plugin-url-emit';
// import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
// import files from 'rollup-plugin-import-file';
// import { string } from 'rollup-plugin-string';

const dependencies = Object.keys(require('./package.json').dependencies);
const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      // sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      // sourcemap: true,
    },
  ],
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  external: [dependencies],
  plugins: [
    styles({ mode: 'inject' }),
    peerDepsExternal(),
    //nodeResolve({ browser: true }),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      sourceMap: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        exclude: ['**/*.stories.*'],
      },
    }),
    json(),
    image({
      extensions: /\.(png|jpg|jpeg|gif|svg)$/,
      limit: 10000,
    }),
    // string({
    //   include: '**/**/*.xlsx',
    // }),
    // files({
    //   output: 'assets/diag_templates',
    //   extensions: /\.(xlsx|doc)$/,
    // }),
    // //importMetaAssets(),
    // url({
    //   // Where to put files
    //   destDir: 'assets/diag_templates',
    //   // Path to put infront of files (in code)
    //   //publicPath: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/assets/diag_templates' : './assets/',
    //   publicPath: 'http://localhost:3000/assets/diag_templates',
    //   // File name once copied
    //   fileName: '[name][extname]',
    //   include: ['**/**/*.xlsx'],
    //   limit: 0,
    // }),
    // пример как можно в bundle копировать дополнительные ресурсы
    copy({
      targets: [
        {
          src: 'src/ol.scss',
          dest: 'build',
          rename: 'ol.scss',
        },
        {
          src: 'src/variables.scss',
          dest: 'build',
          rename: 'variables.scss',
        },
        {
          src: 'src/styles.scss',
          dest: 'build',
          rename: 'styles.scss',
        },
        {
          src: 'src/assets/diag_templates/',
          dest: 'build/assets/',
          //rename: 'eveness.xlsx',
        },
      ],
    }),
  ],
};
