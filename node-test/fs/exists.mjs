/*
	判断文件是否存在-fs.existsSync

  fs.existsSync(path) 同步方法

   如果路径存在，则返回 true，否则返回 false

   注：异步fs.exists已被废除 可用access代替
*/
import { existsSync, access, accessSync } from 'fs'

const isExistsDir = existsSync('./mkdir/a')
console.log(isExistsDir)

const isExistsFile = existsSync('./stat.mjs')
console.log(isExistsFile)


console.log('-------------access----------------')

/*
  fs.access(path[, mode], callback)

  可访问性检查
*/

access('./mkdir/a', (err) => {
  if (err) {
    console.log('err>>', err)
  }
  console.log('文件可访问')
})

const isAccessSync = accessSync('./mkdir/a')
console.log('>>>>', isAccessSync) // 如果可访问则返回 undefined