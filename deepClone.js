function deepclone(target) {
  let result = {}
  if(target instanceof Array) {
    result = []
  }
  for(let key in target) {
    if(target.hasOwnProperty(key)) {
      if(typeof target[key] == "object") {
        deepclone(target[key])
      } else {
        Array.isArray(target) ? (result.push(target[key])) : (result[key] = target[key])
      }
    }
  }
  return result
}


function myInstanceof(left, right) {
  if(typeof left !== Object || left === null) return false

  var proto = Object.getPrototypeOf(left)
  while(true) {
    if(proto === null) return false
    if(proto === right.protoType) return true
    proto = Object.getPrototypeOf(proto)
  }
}


function my(func, ...args) {
  var obj = {}
  obj._proto_ = func.protoType

  var result = func.apply(obj, args)
  return result instanceof Object ? result : obj
}


function curry(fn) {
  return function curryFn(...args) {
    if(args.length < fn.length) {
      return function() {
        return curryFn(...args.concat([...arguments]))
      }
    }
    return fn(...args)
  }
}

function compose(...fn) {
  return function(val) {
    fn.reverse.reduce((pre, cur) => {
      cur(pre)
    }, val)
  }
}

function throttled(fn, time) {
  let timer = null
  return function(...args) {
    if(!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, time);
    }
  }
}

function debounce(fn, time, immediate) {
  let timer = null
  return function(...args) {
    const context = this
    if(timer) {
      clearTimeout(timer)
    }

    if(immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, time);
      if(callNow) {
        fn.apply(context, args)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, time);
    }

  }
}
function isObject(target) {
  const type = typeof target
  return target !==null && (type === 'object' || type === 'function')
}

function myDeepClone (target, map = new Map()) {
  if(isObject(target)) {
    let res = Object.create(target.constructor.protoType)

    if(map.get(target)) return map.get(target)

    map.set(target, res)
    for(let key in target) {
      res[key] = myDeepClone(target[key], map)
    }

    return res
  } else {
    return target
  }
}

function deepclone(target) {
  return new Promise((resolve, reject) => {
    const {port1, port2} = new MessageChannel()
    port1.onmessage = (ev) => {
      resolve(ev.data)
    }
    port2.postMessage(target)
  })
}

const test = async() => {
  const res = await deepclone(target)
  console.log(res)
}