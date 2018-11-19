export default function (Vue) { // 抛出mixin函数 接受一个vue对象
  const version = Number(Vue.version.split('.')[0]) // 拿到版本

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit }) // 2.x版本 在beforeCreate钩子mixin vuexInit方法 下面有定义
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init // 1.x版本 是用_init方法 现在基本都淘汰了 不深究
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  /**
   * 上面是原版注释 注入到每一个Vue实例中
   */

  function vuexInit () {
    const options = this.$options // 这个地方第二遍阅读是注意 mixin之后this就指向当前vue实例了 $options 就是 store router等
    // store injection
    if (options.store) { // 如果参数中含有store
      this.$store = typeof options.store === 'function' // 如果传入的是函数 当前vue.$store就是函数调用的返回值 
        ? options.store()
        : options.store // 否则就是传入的参数
    } else if (options.parent && options.parent.$store) { // 此处代码 请参考Vue源码 mergeOptions函数
      this.$store = options.parent.$store
    }
  }
}
