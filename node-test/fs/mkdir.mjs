/*
	创建目录-fs.mkdir

  fs.mkdir(path, [options], callback)

  参数 {recursive: false} 属性指示是否应创建父文件夹
*/
import { mkdir, mkdirSync } from 'fs'

mkdir('./mkdir/a', (err) => {
  if (err) {
    console.log(err)
  }
})

mkdirSync('./mkdirSync')