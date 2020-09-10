const requireMain = require("./require.main.js");

const a = require('./a.js');

console.log(a)


/*
	foo与bar循环引用，执行顺序：
	1、index.js导入foo.js，开始执行foo.js中的代码
	2、foo.js第一句导入bar.js,然后进入bar.js执行
	3、bar.js第一句引入了foo.js，产生循环依赖，但此时不再进入执行foo.js，而是直接取其导出值，由于foo.js没有执行完毕，module.exports={},所以打印空对象
	4、bar.js执行完毕，回到foo.js，从require语句继续向下执行
	5、最后打印出foo.js中的console值 value of bar
*/
require('./foo.js')
// value fo foo: {}
// value fo bar: this is bar.js