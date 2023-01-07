// 题目需求
// 实现compose函数, 类似于koa的中间件洋葱模型

let middleware = []
middleware.push((context, next) => {
  console.log(1)
  next()
  console.log(1.1)
})
middleware.push((context, next) => {
  console.log(2)
  next()
  console.log(2.1)
})
middleware.push((context, next) => {
  console.log(3)
  next()
  console.log(3.1)
})

function compose(middleware) {
  return (ctx, next) => {
    let index = -1
    function dispatch(i) {
      if(i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let currentMW = middleware[i]
      if(i >= middleware.length) currentMW = next
      if(!currentMW) return Promise.resolve()
      try{
        return Promise.resolve(currentMW(ctx, dispatch.bind(null, i+1)))
      } catch(err) {
        return Promise.reject(err)
      }
    }
    dispatch(0)
  }
}

let fn = compose(middleware)
fn()

/*
1
2
3
3.1
2.1
1.1
*/

