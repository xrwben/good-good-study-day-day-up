## Commom.js

Commom.js在每个模块的首部默认添加以下代码：
```
var module = {
	exports: {}
}
var exports = module.exports
```

- **注意在使用exports是不要直接给exports赋值一个对象，这样会导致其失效**

- **exports 与 module.exports 不能混用，因为重新赋值一个对象引用会导致原本的属性方法丢失**

- **require的模块只执行一次，如果再次require则直接导出上次执行后的结果**

- **require可以动态制定模块加载路径require('/' + pathname)**


## ES6 Module

1、命名导出
```
export const name = 'liben'
export const add = (a, b) => { return a + b }
```
or 先声明再导出
```
const name = 'liben'
const add = (a, b) => { return a + b }
export { name, add as sum }
```

2、默认导出
```
export default {
	name: 'liben',
	add: (a, b) => { return a + b }
}
```
**默认导出只能有一个，可以理解为对外输出一个名为default的变量**

3、import语法导入

- import带有命名导出的模块时，`import { name, add as getSum } from a.js`，并且变量要一致

- import多个变量是也可以`import * as aa from a.js`

- import默认导出`import aa from a.js`

- 也可以混合导入`import react, { Component } from react`


### CommomJS与ES6 Module的区别

* CommonJS是动态的，支持表达式，模块的导入、导出发生在代码的运行阶段

* ES6 Module的导入导出是声明式的，必须在模块的顶层作用域，在编译阶段就确定了模块的依赖关系

* 在导入一个模块时，CommomJS是获取一份拷贝，而ES6 Module则是值得动态映射，但又不能对import的变量进行更改

* 循环依赖问题，都可能导致无法正确执行，由于ES6 Module的动态映射特性可以使其更好的支持循环依赖，但是需要开发者来保证


## AMD (异步模块定义Asynchronous Module Definition)

AMD是RequireJS在推广过程中对模块定义的规范化产出

```
define('getSum', ['calculater'], function(math) {
	return function(a, b) {
		console.log('sum:' + calculator.add(a, b))
	}
})

require(['getSum'], function(getSum) {
	getSum(2, 3)
})
```
**第一个参数是当前模块的id(模块名)，第二个参数是当前模块的依赖，第三个参数是用来描述模块的导出值，可以是函数或对象**

优：非阻塞  缺：语法冗长，回调地狱


## CMD (通用模块定义Common Module Definition)

CMD是SeaJS 在推广过程中对模块定义的规范化产出

```
define(function(require, exports, module) {
	// var $ = require('jquery')
})
```
API：seajs.use、 seajs.config、define、 require、 require.async、 exports、 module.exports等

### AMD与CMD区别

- AMD在加载完成定义（define）好的模块就会立即执行，所有执行完成后，遇到require才会执行主逻辑。（提前加载）

- CMD在加载完成定义（define）好的模块，仅仅是下载不执行，在遇到require才会执行对应的模块。（按需加载）

- AMD用户体验好，因为没有延迟，CMD性能好，因为只有用户需要的时候才执行。


## UMD (通用模块标准Universal Module Definition)

```
(function(global, main) {
	// 根据当前的环境采取不同的导出方式
	if (typeof define === 'function' && define.amd) {
		// ADM
		define(...)
	} else if (typeof exports === 'object') {
		// CommomJS
		module.exports = {}
	} else {
		// 非模块化环境
		global.add = ...
	}
})(this, function() {
	return {...}
})
```
**目标是使一个模块能运行在各种环境下**

