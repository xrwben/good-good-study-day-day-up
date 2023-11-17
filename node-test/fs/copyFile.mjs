/*
	拷贝文件-copyFile

  fs.copyFile(filenameA, filenameB，callback)

  第一个参数原始文件名 第二个参数要拷贝到的文件名(如果文件不存在则创建)
*/
import { copyFile, copyFileSync } from 'fs'

copyFile('readFile.txt', 'copyFile.txt', (err) => {
  if (err) {
    console.log(err)
  }
})

console.log('-------同步拷贝-------')

copyFileSync('readFile.txt', 'copyFileSync.txt')