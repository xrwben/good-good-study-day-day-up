/*
  读取目录内容-fs.readdir

	fs.readdir(path[, options], callback)

  读取一个目录的内容, 回调有两个参数 (err, files)，其中 files 是目录中不包括 '.' 和 '..' 的文件名的数组
*/
import { readdir, readdirSync } from 'fs'

readdir('./', (err, files) => {
  if (err) {
    console.log(err)
  }
  console.log('>>>', files)
})

const files = readdirSync('./')
console.log(files)