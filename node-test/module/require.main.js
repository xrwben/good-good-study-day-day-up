/*
	require.mian === module 判断一个文件是否被直接运行 返回true或false

*/

console.log(require.main)

console.log(module)

console.log("当前文件时被直接运行？", require.main === module)