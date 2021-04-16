const process = require("process");

console.log(process.argv)  
/*
	process.argv 属性会返回一个数组，其中包含当 Node.js 进程被启动时传入的命令行参数

	node process.js 123 => 输出结果如下

	[ 'C:\\Program Files\\nodejs\\node.exe',
  'F:\\liben\\good-good-study-day-day-up\\node-test\\process\\process.js',
  '123' ]
*/


console.log(process.arch)  //  CPU 架构  x64


console.log(process.env)

console.log(process.exit(88))