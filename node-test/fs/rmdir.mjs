/*
	删除目录-fs.rmdir

  fs.rmdir(path,callback)

  目录不为空无法删除
*/
import { rmdir, rmdirSync } from 'fs'

rmdir('./mkdir/a', (err) => {
  if (err) {
    console.log(err)
  }
})

rmdirSync('./mkdirSync')