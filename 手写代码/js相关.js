// 深拷贝
function deepClone(target) {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj)
  }
  return new Promise((reslove, reject) => {
    const {port1, port2} = new MessageChannel()
    port1.postMessage(target)
    port2.onmessage = (ev) => {
      reslove(ev.data)
    }
  })
}

function deepClone2(target, map = new WeakMap()) {
  if(!target) return target
  if(typeof target === 'symbol') return Symbol(target.description)
  if(typeof target !== 'object') return target
  if(target instanceof Date) return new Date(target)
  if(target instanceof RegExp) return new RegExp(target)
  // 解决循环引用
  if(map.get(target)) return map.get(target)

  let protoType = Object.getPrototypeOf(target)
  let description = Object.getOwnPropertyDescriptor(target)
  let res = Object.create(protoType, description)
  map.set(target, res)
  for(let key in target) {
    if(target.hasOwnProperty(key)) {
      res[key] = deepClone2(target[key], map)
    }
  }
  // Object.keys(target).forEach((key)=> {
  //   res[key] = deepClone2(target[key], map)
  // })
  return res
}

// vue懒加载指令
const lazyLoad = {
  bind: (el, {value}) => {
    el.setAttribute('data-src', value)
  },
  inserted: (el, {value}, vm) => {
    // value === el.dataset.src
    if('intersectionObserver' in window) {
      var io = new IntersectionObserver((entries)=>{
        if(entries[0].isIntersecting) {
          el.src = value
          io.unobserve(entries[0].target)
          el.removeAttribute('data-src')
        }
      })
      io.observe(el)
    } else {
      window.addEventListener('scroll', function(e){
        var scrollTop = e.scrollTop
        var offsetTop = el.offsetTop
        var height = document.documentElement.clientHeight
        if(offsetTop - scrollTop - height < 20) {
          el.src = value
          el.removeAttribute('data-src')
        }
      })
    }

  }
}

// 实现promise.all
const MyPromiseAll = (arr) => {
  let result = []
  return new Promise((reslove, reject) => {
    arr.forEach(( item, index)=> {
      item.then((data)=>{
        result.push(data)
        if(result.length === arr.length) {
          reslove(result)
        }
      }, reject)
    })
  })
}

// 实现promise.allsettled
const MyPromiseAllSettled = (arr) => {
  let result = []
  return new Promise((reslove, reject) => {
    arr.forEach(item=> {
      item.then((data)=>{
        result.push({
          status: 'fulfilled',
          value: data
        })
      }, (reason)=>{
        result.push({
          status: 'rejected',
          value: reason
        })
      }).finally(()=>{
        if(result.length === arr.length) {
          reslove(result)
        }
      })
    })
  })
}

// 节流
function throttle(fn, wait) {
  let timer = null

  return function(...args) {
    let context = this
    if(!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        clearTimeout(timer)
      }, wait);
    }
  }
}

// 防抖
function debounce(fn, wait, immediate) {
  let timer = null

  return function(...args) {
    let context = this
    if(timer) clearTimeout(timer)

    if(immediate) {
      var callnow = !timer
      setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, timeout);
      if(callnow) {
        fn.apply(context, args)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait);
    }
  }
}

// es6继承
function es6Extend(son, parent) {
  son.prototype = Object.create(parent.prototype)
  son.prototype.constructor = son
}
// ********分割线********
class Parent {
  constructor(name) {
    this.name = name
  }

  aaa() {
    console.log(this.name)
  }
}

class Son extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }

  aaa() {
    console.log(this.age)
  }
}

var child = new Son('hhh', 18)
child.aaa()

// 实现instanceof
function myInstanceof(obj, fn) {
  // 基本类型或者null直接返回false
  if(typeof obj !== 'object' || obj === null) return false
  var proto = obj._proto_
  while(true) {
    if(proto === null) return false
    if(proto === fn.protoType) return true
    proto = proto._proto_
  }
}

// 实现new
function myNew(fn, ...args) {
  var obj = {}
  obj._proto_ = fn.prototype

  var res = fn.apply(obj, args)
  return res instanceof Object ? res : obj
}


Function.prototype.MyCall = (context, ...args) => {
  if(typeof this !== 'function') {
    throw new Error('type error')
  }
  var context = context || window
  // 使key唯一
  var key = Symbol('key')
  context[key] = this
  var result = context[key](...args)
  delete context[key]
  return result
}

Function.prototype.myApply = (context, args)=> {
  if(typeof this !== 'function') {
    throw new Error('type error')
  }

  var context = context || window
  var param = args || []
  var key = Symbol('key')
  context[key] = this
  var result = context[key](...param)
  delete context[key]
  return result
}

Function.prototype.myBind = (context = window, ...args) => {
  if(typeof this !== 'function') {
    throw new Error('type error')
  }

  var self = this

  var fn = function(...innerArgs) {
    var param = args.concat(innerArgs)
    return self.apply(
      // 作为构造函数使用忽略传入的this
      this instanceof fn ? this : context,
      param
    )
  }

  // 作为构造函数，原型上的属性和方法不能丢
  fn.prototype = Object.create(this.prototype)
  return fn
}
