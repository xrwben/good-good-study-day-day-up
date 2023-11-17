/*
	删除文件-unlink

  fs.unlink(filename, callback)
*/
import { unlink, unlinkSync } from 'fs'

unlink('unlink1.mjs', (err) => {
  if (err) {
    console.log('>>>', err)
  }
})

unlinkSync('unlink2.mjs')