// Fn.call(this, arg1,arg2)
Function.prototype.MyCall = function(context, ...args) {

  context = context ? context : window
  context.fn = this
  var result = context.fn(...args)
  delete context.fn

  return result
}


Function.prototype.MyApply = function(context, args) {

  context = context ? context : window
  context.fn = this
  var result = context.fn(...args)
  delete context.fn

  return result
}

Function.prototype.MyBind = function(context, ...args) {
  if(typeof this !== 'function') {
    throw new Error()
  }

  var fn = this
  return function Fn() {
    return fn.apply(context, [...args].concat(arguments))
  }
}