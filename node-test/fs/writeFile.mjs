/*
	文件写入-fs.writeFile

	fs.writeFile(filename, data, [options], callback)

	1、如果文件不存在会创建一个文件 2、写入时会先清空文件
*/
import { writeFile, writeFileSync, appendFile } from 'fs'

writeFile('writeFile.txt', '异步写入一个文件123abc', (err) => {
	if (err) {
    console.log('写入文件失败')
  }
})

writeFile('writeAppendFile.txt', '异步写入一个文件123abc 并追加文件', {'flag':'a'}, (err) => {
  if (err) {
    console.log('追加写入文件失败')
  }
})

console.log('-------同步写入--------')

writeFileSync('writeFileSync.txt', '123456——happy new year 新年快乐')
console.log('finished')


console.log('-------文件追加--------')
appendFile('writeFile.txt', '追加写入 hahahahaha', (err) => {
  if (err) {
    console.log('追加写入文件失败')
  }
})