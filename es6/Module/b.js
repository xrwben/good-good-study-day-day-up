
/*
	倒出a.js的所有方法属性 注意export *命令会忽略模块的default方法
*/

export * from "./a.js" 

export function b () {
	console.log("我是b.js")
}