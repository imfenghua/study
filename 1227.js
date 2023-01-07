// 按顺序发送四个请求， 并按照结果输出
function getData(urls) {
  let result = [];
  return new Promise((resolve, reject) => {
    for(let i = 0; i < urls.length; i++) {
      fetch(urls[i]).then(res => {
        result.push(res);
      }).catch(err => {
        result.push(err);
      }).finally(() => {
        if(result.length === urls.length) {
          resolve(result);
        }
      })
    }
  })
}

function deepClone(target, map = new WeakMap()) {
  if(!target) return target
  if(typeof target !== 'object') return target
  if(target instanceof Date) return new Date(target)
  if(target instanceof RegExp) return new RegExp(target, target.flags)

  if(typeof target === 'object') {
    if(map.get(target)) return map.get(target)
    let res = Object.create(target.constructor.prototype)
    map.set(target, res)
    Object.keys(target).forEach((key) => {
      res[key] = deepClone(target[key], map)
    })
    return res
  }
}