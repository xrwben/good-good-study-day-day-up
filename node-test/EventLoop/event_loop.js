/*
  node事件循环机制

  js单线程、异步，分宏任务+微任务，同和浏览器的主要区别就是【类型】和【优先级】

  浏览器宏任务没有优先级，而node中的宏任务有优先级，且任务类型有差异

  【六个宏任务】：
  Timer：setTimeout、setInterval
  I/O callbacks：处理网络、流、TCP的错误回调
  Idle,prepare：闲置状态（nodejs内部使用）
  Poll轮询：执行poll中的I/O队列
  Check检查：存储setImmediate回调
  Close callbacks：关闭回调，如socket.on('close')

  执行顺序：同步任务 -> 微任务 -> 宏任务（每个宏任务前都检查是否存在微任务）

*/

console.info('start')
setImmediate(() => {
  console.info('setImmediate')
})
setTimeout(() => {
  console.info('timeout')
})
Promise.resolve().then(() => {
  console.info('promise then')
})
process.nextTick(() => { // 微任务
  console.info('nextTick')
})
console.info('end')


// start -> end -> nextTick -> promise then -> timeout -> setImmediate