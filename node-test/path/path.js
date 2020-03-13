const path = require('path');

// console.log(path)

// 注意: **方法7** 为常用方法

/*
	方法1 path.basename(path)  返回path的最后一部分path.js 可能不同系统有所差异
*/
console.log(path.basename("F:\\liben\\node\\path.js"));
// path.js



/*
	方法2 path.delimiter 提供平台特定的路径定界符  windows => ";"   POSIX => ":"
*/
console.log(process.env.PATH)
// 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\' 

console.log(process.env.PATH.split(path.delimiter))
// 返回: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']


/*
	方法3 path.dirname(path) 返回path的目录名
*/
console.log(path.dirname("F:\\liben\\node\\path.js"))
// 打印: F:\\liben\\node


/*
	方法4 path.extname(path) 返回path的扩展名
*/
console.log(path.extname("F://liben/node/path.js"))
// 打印: .js

console.log(path.extname("F://liben/node/path"))
// 打印: ''

console.log(path.extname("F://liben/node/path.js.md"))
// 打印: .md

console.log(path.extname(".md"))
// 打印: ''



/*
	方法5 path.join([...path]) 用"平台特定的分隔符"作为定界符将所有给定的path片段连接在一起
*/
console.log(path.join("/F:", "liben", "/node", "path.js"))
// 打印: \liben\node\path.js

console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..', "index.html"))
// 打印： \foo\bar\baz\asdf\index.html


/*
	方法6 path.relative(from, to) 根据当前工作目录返回 from 到 to 的相对路径 从前面路劲为基础开始找
*/
console.log(path.relative('F:\\liben\\git-test\\readme.md', 'F:\\guojiang\\xg-tpl\\src\\index.html'))
// 打印: ..\..\..\guojiang\liben\node\path

console.log(path.relative('F:\\liben\\git-test\\good\\study\\readme.md', 'F:\\guojiang\\xg-tpl\\src\\index.html'))
// 打印: ..\..\..\..\..\guojiang\xg-tpl\src\index.html

console.log(path.relative('F:\\liben\\git-test', 'F:\\guojiang\\xg-tpl\\src\\index.html'))
// 打印: ..\..\guojiang\xg-tpl\src\index.html


/*
	方法7 path.resolve([...path]) 将路径或路径片段的序列解析为绝对路径  从右到左进行处理 **直到构造出一个绝对路径**

		如果在处理完所有给定的 path 片段之后还未生成绝对路径则再加上当前工作目录

		除非将路径解析为根目录 否则将删除尾部斜杠

		* 如果没有传入 path 片段 则 path.resolve() 将返回当前工作目录的绝对路径
*/
console.log(path.resolve())
// 打印: F:\liben\good-good-study-day-day-up\node-test\path

console.log(path.resolve("/foo/bar", "./bar"))
// 打印: /foo/bar/bar

console.log(path.resolve("/foo/bar", "/bar"))
// 打印: /bar

console.log(path.resolve("/foo/bar", "/vaar/"))
// 打印: /vaar

console.log(path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')) 
// ..表示跳出上一层
// 打印: F:\liben\good-good-study-day-day-up\node-test\path\wwwroot\static_files\gif\image.gif


/*
	属性8 path.sep 不同平台的路径片段分隔符 Windows => \  POSIX => /
*/
console.log('foo\\bar\\baz'.split(path.sep))
// window => [ 'foo', 'bar', 'baz' ]