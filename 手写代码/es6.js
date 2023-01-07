// 手写const
function myConst(name, value) {
  window[name] = value
  Object.defineProperty(window, name, {
    configurable: false,
    enumerable: false,
    get: () => {
      return value
    },
    set: (newVal) => {
      if(newVal !== value) {
        throw new Error()
      } else {
        return value
      }
    }
  })
}


// 实现迭代器对象生成函数
function createIterator(list) {
  var index = 0, len = list.length

  return {
    next: function() {
      var done = index >= len
      var value = !done ? list[index++] : undefined
      return {
        value,
        done
      }
    }
  }
}

// 实现es6的extends
function Father(name) {
  this.name = name
}

function Son(name, age) {
  Father.call(this, name)
  Son.prototype = new Father(name)
  this.age = age
  return this
}

// 实现object.create
function myObjectCreate(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

// 实现Object.is
// Object.is(+0,-0) false
// Object.is(NaN,NaN) true
function myObjectIs(a,b) {
  if(a===b) {
    return a != 0 || (1/a === 1/b)
  } else {
    return isNaN(a) && isNaN(b)
  }
}

// Object.freeze
function myObjectFreeze(obj) {
  if(obj instanceof Object) {
    Object.seal(obj)
    for(let key in obj) {
      if(obj.hasOwnProperty(key)) {
        Object.defineProperty(obj, key, {
          writable: false
        })
        myObjectFreeze(obj[key])
      }
    }
  }
}
