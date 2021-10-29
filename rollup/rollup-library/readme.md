### rollup基础插件

- rollup-plugin-alias: 提供modules名称的 alias 和reslove 功能

- rollup-plugin-babel: 提供babel能力

- babel-plugin-transform-runtime: 将 helper 和 polyfill都改为从一个统一的地方引入, 允许重用Babel的注入帮助代码，以节省代码大小

- rollup-plugin-eslint: 提供eslint能力

- rollup-plugin-node-resolve: 解析 node_modules 中的模块

- rollup-plugin-commonjs: 转换 CJS -> ESM, 通常配合上面一个插件使用

- rollup-plugin-json: 处理json文件

- rollup-plugin-filesize: 显示 bundle 文件大小

- rollup-plugin-uglify: 压缩 bundle 文件，但只能翻译es5的语法

- rollup-plugin-terser： 适用于ES6 +的JavaScript解析器，mangler和压缩器工具包

- rollup-plugin-replace: 类比 Webpack 的 DefinePlugin , 可在源码中通过 process.env.NODE_ENV 用于构建区分 Development 与 Production 环境.

- rollup-plugin-serve: 类比 webpack-dev-server, 提供静态服务器能力

- rollup-plugin-livereload: 启动热更新，这个热更新是自动刷新浏览器的哦，更改css或者js都会自动的刷新浏览器