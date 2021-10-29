import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';

export default {
	// 打包入口 如果多个则output必须配置dir选项
	input: 'src/index.js',
	// input: [
	// 	'src/index.js',
	// 	'src/main.js'
	// ],
	output: {
		// dir: 'lib',
		file: 'dist/bundle.js',
		format: 'esm',
		name: 'dll'
	},
	// output: [
	// 	{
	// 		file: 'dist/index.cjs.js',
	// 		format: 'cjs'
	// 	}
	// 	,{
	// 		file: 'dist/index.esm.js',
	// 		format: 'esm'
	// 	},
	// 	{
	// 		file: 'dist/index.js',
	// 		format: 'umd',
	// 		name: 'dll'
	// 	}
	// ],
	// 告诉 Rollup jquery 模块的id等同于 $ 变量
	globals: {
		jquery: '$'
	},
	plugins: [
		resolve(),
		commonjs(),
		builtins(),
		babel({
			babelHelpers: 'runtime',
			exclude: "node_modules/**",
		}),
		// 本地服务器
		serve({
			host: 'localhost',
			port: 8080,
			contentBase: './',
			historyApiFallback: true
		}),
		// terser()
	],
	// 指出应将哪些模块视为外部模块，不打包进来
	external: [''],
	watch: {
		include: 'src/**',
	    exclude: 'node_modules/**'
	},
	
}