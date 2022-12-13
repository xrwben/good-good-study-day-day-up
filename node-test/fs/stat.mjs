/*
  文件或目录的详细信息 - fs.stat

  fs.stat(path, callback)

  回调有两个参数 (err, stats) 其中 stats 是一个 fs.Stats 对象 可以使用属性和方法
*/
import { stat, statSync } from 'fs'

stat('./mkdir', (err, stat) => {
  if (err) {
    console.log(err)
  }
  console.log('stat>>>>', stat.isDirectory())
})

const statObj = statSync('./')
console.log(statObj)