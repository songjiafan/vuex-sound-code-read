/**
 * 此文件是桥接vuex及vue-devtools的插件
 */

const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__
/**
 * 定义钩子判断 当前是不是在window对象下 且 window对象下是否有__VUE_DEVTOOLS_GLOBAL_HOOK__这个钩子 
 * vue-devtools这个插件会向window注入一个对象具体如下
 * { Vue: ƒ, on: ƒ, once: ƒ, off: ƒ, emit: ƒ }
 * 没有具体分析这个插件的内部是如何实现的 看这个对象以及本方法应该是以这个对象进行通信 捕捉变化
 * 后续如果想做类似的插件 可以借鉴这个思想
 */
export default function devtoolPlugin (store) {
  if (!devtoolHook) return // 如果没有插件标识 返回

  store._devtoolHook = devtoolHook // 定义私有属性

  devtoolHook.emit('vuex:init', store) //  初始化时会触发这个init方法给devtools 默认值是store中的默认值

  devtoolHook.on('vuex:travel-to-state', targetState => {
    store.replaceState(targetState) // state变更 这里采用了on的方法进行监控目标state 用store中的replaceState进行
  })

  store.subscribe((mutation, state) => {
    devtoolHook.emit('vuex:mutation', mutation, state) // 如果有mutation事件触发了 也会触发到这里
  })
}
