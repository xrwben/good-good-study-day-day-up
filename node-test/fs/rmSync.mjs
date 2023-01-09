/*
	同步删除文件-fs.rmSync

  fs.rmSync(path, callback)

  path: 它包含必须删除的文件的路径。它可以是字符串，缓冲区或URL

  options: 该对象可用于指定将影响操作的可选参数，如下所示：

    force: 默认false ,如果为true 即使路径不存在，则将忽略异常

    recursive: 默认false，它指定是否执行递归目录删除。在这种模式下，如果找不到指定的路径并且在失败时重试该操作，
    则不会报告错误。

*/
import { rmSync } from 'fs'

// rmSync('./rmDir/b') // 如果路径不存在则控制台会报错

rmSync('./rmDir/c', { force: true })  // 路径不存在也不报错

// rmSync('./rmDir/a') // 如果文件夹存在子文件则报错

rmSync('./rmDir/a', { recursive: true }) // 递归删除

