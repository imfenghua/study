let activeEffect
let effectStack = []
let targetMap = new WeakMap()


function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      if (!activeEffect) return;
      track(target,key)
      return target[key]
    },
    set(target, key, newVal, receiver) {
      if(target[key] === newVal) return
      trigger(target, key)
      return Reflect.set(target, key, newVal)
    }
  }
  return new Proxy(target, handler)
}



function effect(fn, option={}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    // 避免嵌套的effect， 内部effect会将外部的effect覆盖
    effectStack.push(activeEffect)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }

  effectFn.option = option
  effectFn.deps = []

  if(!option.lazy) {
    effectFn()
  }

  return effectFn
}

// 避免副作用函数产生遗留
function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }

  effectFn.deps.length = 0

}

function track(target, key) {
  let depMap = targetMap.get(target)
  if(!depMap) {
    targetMap.set(target, depMap = new Map())
  }

  let deps = depMap.get(key)
  if(!deps) {
    depMap.set(key, deps = new Set())
  }

  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

function trigger(target, key) {
  const depMap = targetMap.get(target)
  if(!depMap) return

  const deps = depMap.get(key)
  const effectDeps = new Set()
  deps.forEach(effect => {
    // 当读取和赋值在同一个effect里面的时候，避免造成死循环
    if(effect !== activeEffect) {
      effectDeps.add(effect)
    }
  })
  effectDeps.forEach(effectFn => {
    if(effectFn.option && effectFn.option.scheduler) {
      effectFn.option.scheduler(effectFn)
    } else {
      effectFn()
    }
  });
}

function computed(getter) {
  let dirty = true
  let value

  const effectFn = effect(getter, {
    lazy:true,
    scheduler(effectfn) {
      dirty = true
      trigger(obj, 'value') // 手动trigger是为了保证副作用函数中使用到计算属性的情况
    }
  })

  const obj = {
    get value() {
      if(dirty) {
        value = effectFn()
        dirty = false
      }
      track(obj, 'value')// 手动track是为了保证副作用函数中使用到计算属性的情况
      return value
    }
  }

  return obj
}

const traverse = (value, set = new Set()) => {
  if(typeof value !== 'object' || value === null || set.has(value)) return
  set.add(value)
  for(const key in value) {
    traverse(value[key], set)
  }
  return value
}

function watch(source, cb, option={}) {
  let getter
  let oldValue
  let newVal
  let cleanup // watch过期函数的回调

  if(typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }



  const effectFn = effect(getter, {
    lazy:true,
    scheduler: () => {
      if(option.flush === 'post') {
        Promise.resolve().then(() => {
          job()
        })
      } else {
        job()
      }
    }
  })

  function onInvalidate(fn) {
    cleanup = fn
  }

  const job = () => {
    newVal = effectFn()
    if(cleanup) {
      cleanup()
    }
    cb(newVal, oldValue, onInvalidate)
    oldValue = newVal
  }

  if(option.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

// test
const data = { foo: 1, bar: 2 };
const obj = reactive(data)

// let temp1, temp2;

// effect(function effectFn1() {
//   console.log('effectFn1 process');

//   effect(function effectFn2() {
//     console.log('effectFn2 process');
//     temp2 = obj.bar;
//   });

//   temp1 = obj.foo;
// });

// setTimeout(() => {
//   obj.foo = false;
// }, 1000);

let finalData;

watch(obj, async (newVal, oldVal, onInvalidate) => {
  let expired = false;

  onInvalidate(() => {
    expired = true;
  });

  const res = await fetch('https://service.yueluo.club/');
  const data = await res.json();

  if (!expired) {
    console.log(data); // 只打印一次结果
    finalData = data;
  }
})

obj.foo++;
obj.foo++;