function Singleton(name) {
  this.name = name
  this.instance = null
}

Singleton.getInstance = (name) => {
    if(!this.instance) {
      return new Singleton(name)
    }
    return this.instance
}


// 获取对象1
const a = Singleton.getInstance('a');
// 获取对象2
const b = Singleton.getInstance('b');
// 进行比较
console.log(a === b);

//****************************************************************/
// 第二种构造函数方式&闭包
function Singleton(name) {
  this.name = name
}

const CreatSingleton = (function() {
  let instance
  return function(name) {
    if(!instance) {
      instance = new CreateSingleton(name);
    }
    return instance;
    }
})()

const c = new CreatSingleton('c');
// 获取对象2
const d = new CreatSingleton('d');
// 进行比较
console.log(c === d);



// proxy+闭包
function singletonProxy(fn) {
  var instance
  var handlers = {
    construct(target, args) {
      if(!instance) {
        instance = Reflect.construct(fn, args)
      }
      return instance
    }
  }

  return new Proxy(fn, handlers)
}