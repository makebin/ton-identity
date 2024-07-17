// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';  // 更新导入方式

export default {
  input: 'src/index.js', // 入口文件
  output: {
    file: 'dist/ton-identity.umd.js',
    format: 'umd',
    name: 'TonIdentity', // UMD 模块名称
    globals: {
      // 在这里指定任何外部库，例如 'jquery': '$'
    }
  },
  plugins: [
    resolve(), // 解析 node_modules 中的依赖
    commonjs(), // 转换 CommonJS 模块为 ES6
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // 只编译我们的源代码
      presets: ['@babel/preset-env'] // 使用 preset-env 将代码转换为 ES5
    }),
    terser({
      compress: {
        drop_console: true,
      },
    }) // 压缩代码
  ]
};
