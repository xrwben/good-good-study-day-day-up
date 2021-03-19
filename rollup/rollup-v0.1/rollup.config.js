import commonjs from "rollup-plugin-commonjs"; // 插件将它们转换为ES6版本
import json from "rollup-plugin-json";  // 插件的作用是读取json信息
import resolve from "rollup-plugin-node-resolve";  // 插件容许咱们加载第三方模块
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
// const autoprefixer = require('autoprefixer')
// import clear from "rollup-plugin-clear";
// import serve from "rollup-plugin-serve";

// import path from "path";

export default {
	input: "src/index.js",
	output: {
		file: "./dist/bundle.js",
		format: "umd",
		name: "dll",  // 全局名称挂载到window
		globals: {    // 这跟external 是配套使用的，指明global.Vue即是外部依赖vue
	  		vue: "Vue"
  		}
	},
	plugins: [
		// clear({
		// 	targets: ['dist']} //清除dist目录
		// ),
		commonjs(),
		json(),
		resolve(),
		babel({
			exclude: "node_modules/**",
			runtimeHelpers: true
		}),
		postcss({
			extensions: ['.css', '.less'],
			// minimize: true, // 压缩
			// plugins: [
			// 	require("autoprefixer")
			// ],
			// extract: path.resolve("./dist/reset.css") // 打包为单独文件
		}),
		// serve({
	 //      	host: 'localhost',
	 //      	port: 10001,
		// 	// open: true, // 是否打开浏览器
	 //    	contentBase: './', // 入口html的文件位置
	 //      	historyApiFallback: true
		// })
	],
	// 指出应将哪些模块视为外部模块 不打包
  	external: ["vue"],
	// watch: {
	// 	include: "src/**",
	// 	exclude: "node_modules/**"
	// }
};