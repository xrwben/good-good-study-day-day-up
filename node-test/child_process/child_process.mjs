/*
	child_process - 子进程

	child_process.exec(command[, options][, callback]) 启动子进程来执行shell命令,可以通过回调参数来获取脚本shell执行结果

	child_process.execfile(file[, args][, options][, callback]) 与exec类型不同的是，它执行的不是shell命令而是一个可执行文件

	child_process.spawn(command[, args][, options])仅仅执行一个shell命令，不需要获取执行结果

	child_process.fork(modulePath[, args][, options])可以用node执行的.js文件，也不需要获取执行结果。fork出来的子进程一定是node进程

	exec()与execfile()在创建的时候可以指定timeout属性设置超时时间，一旦超时会被杀死

	如果使用execfile()执行可执行文件，那么头部一定是#!/usr/bin/env node
*/

import { spawn, execFile } from 'child_process'

console.log('-----------spawn ----------')

const git = spawn('git', ['status']);

git.stdout.on('data', (data) => {
  console.log(`>>>>>stdout: ${data}`)
})

git.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`)
})

git.on('close', (code) => {
  console.log(`>>>>>>子进程退出码：${code}`)
})

console.log('-----------execFile ----------')

const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error
  }
  console.log('>>>>', stdout)
  console.log('>>>>', stderr)
})