/*
  文件读取-fs.readFile

  fs.readFile(filename,[encoding],[callback(error,data)]

  如果指定 encoding ， data是一个解析后的字符串，否则将会以 Buffer 形式表示的二进制数据
*/

import { readFile, readFileSync } from 'fs'

readFile('readFile.txt', (err, data) => {
  if (err) {
    console.log(err)
  }
  console.log('>>>>', data)
  // 没有指定编码则返回Buffer流 <Buffer 31 32 33 34 35 36 e2 80 94 e2 80 94 68 61 70 70 79 20 6e 65 77 20 79 65 61 72 20 e6 96 b0 e5 b9 b4 e5 bf ab e4 b9 90 0d 0a 31 32 33 34 35 36 e2 80 94 ... 30 more bytes>
})

readFile('readFile.txt', 'utf8', (err, data) => {
	if (err) {
    console.log(err)
  }
  console.log('>>>>', data)
  // utf8编码则返回文件内容
})

// 同步读取
const content = readFileSync('readFile.txt', 'utf8')
console.log(content)