#### Vue2和Vue3的区别？

- 响应式原理，Object.defineProperty -> Proxy

- 代码结构调整，更便于Tree shaking，体积更小，api按需引入

- 编码方式(选项式、组合式API)

- 生命周期

- 多节点

- 增减一些组件和API（filters、Teleport、Suspense、事件总线）

- 更好的TypeScript支持，源码ts编写，Flow静态类型检测器



#### Diff算法？

回答思路：

1、diff算法是什么？ 
2、为什么需要？
3、执行时机？
4、执行方式？
5、vue3优化？

- Vue中diff算法又称patching算法，是比较虚拟DOM的一种算法，它是由Snabbdom修改而来
- 虚拟DOM转化为真实DOM的过程中执行，源码是在render.ts这个文件中实现
- patch执行是一个递归的过程，遵循深度优先、同层比较的策略。
- 首先判断新旧节点是否是相同节点，如果不是就删除重建。如果是文本节点则更新文本属性，如果是相同元素节点，则递归比较子节点
- vue3在执行diff算法时，区分静态节点及不同类型的动态节点，PatchFlag 动态节点做标志