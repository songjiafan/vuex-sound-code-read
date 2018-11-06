// Credits: borrowed code from fcomb/redux-logger
/**
 * 这里注释挺有意思 告诉了大家这段代码是从redux-logger借鉴（抄）的
 */
import { deepCopy } from '../util' // 加载深拷贝工具方法
/**
 * 整体这个方法 是对打日志功能(console.log等等)进行二次封装
 */
export default function createLogger ({ // 定义一个方法 接受一个对象类型的参数
  collapsed = true, // 是否可折叠
  filter = (mutation, stateBefore, stateAfter) => true, // filter方法
  transformer = state => state, // transformer方法
  mutationTransformer = mut => mut, // mutationTransformer 方法
  logger = console
} = {}) {
  return store => {
    let prevState = deepCopy(store.state) // 深拷贝当前所有state

    store.subscribe((mutation, state) => {
      if (typeof logger === 'undefined') { // 增加容错的判断
        return
      }
      const nextState = deepCopy(state) // store中state变动时 第一时间进行

      if (filter(mutation, prevState, nextState)) {
        const time = new Date()
        const formattedTime = ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`
        const formattedMutation = mutationTransformer(mutation)
        const message = `mutation ${mutation.type}${formattedTime}`
        const startMessage = collapsed
          ? logger.groupCollapsed 
          : logger.group
        // console对象下的方法 二者都是直接打出group的日志 区别是groupCollapsed初始化时折叠的 group是展开的
        // render
        try {
          startMessage.call(logger, message)
        } catch (e) {
          console.log(message)
        }

        logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState))
        logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation)
        logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState))

        try {
          logger.groupEnd()
        } catch (e) {
          logger.log('—— log end ——')
        }
      }

      prevState = nextState
    })
  }
}

function repeat (str, times) {
  return (new Array(times + 1)).join(str)
}

function pad (num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num
}
