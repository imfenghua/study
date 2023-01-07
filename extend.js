function Fn(father, son) {
  son.prototype = Object.create(father.prototype)
  son.prototype.constructor = son
}


function myDebounce (fn, wait) {
  var timer = null

  return function(...args) {

    if(timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, [...args])
    }, wait);

  }
}