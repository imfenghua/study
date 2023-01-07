function findIndex(arr, target) {
  let left = 0, right = arr.length -1
  while(left <= right) {
    let mid = Math.floor(left + (right-left)/2)
    if(arr[mid] < target) {
      left = mid+1
    } else if(arr[mid] > target) {
      right = mid-1
    } else {
      left = mid + 1
    }
  }
  // left = right+1
  if(right < 0) return -1
  return arr[right] === target ? right : -1

}
// let res = findIndex( [1, 2, 3, 4, 7, 7, 7, 9, 12, 23, 34, 45, 55, 67], 7)
// console.log(res)

function removeDuplicates(arr) {
  let map = new Map()
  arr.forEach(item => {
    const key = typeof item === 'object' ? JSON.stringify(item) : item
    if(!map.has(key)) {
      map.set(key, item)
    }
  })
  return [...map.values()]
}
// let res = removeDuplicates([123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"])
// console.log(res)


var template = "{{name}}很厉害，才{{age}}岁"
var context = {name:"bottle",age:"15"}
function render(template, context) {
  return template.replace(/\{\{(.*?)\}\}/g, function(match, key) {
    console.log(match, typeof match)
    return context[key.trim()]
  })
}
console.log(render(template, context))

function deepCloneObj(target, map = new Map()) {
  if(!target) return target
  if(typeof target !== 'object') return target
  if(map.has(target)) return map.get(target)
  let cloneTarget = Object.create(Object.getPrototypeOf(target))
  map.set(target, cloneTarget)
  for(let key in target) {
    cloneTarget[key] = deepCloneObj(target[key], map)
  }
  return cloneTarget
}

function promiseall(promises) {

  return new Promise((resolve,reject) => {
    let result = []
    let count = 0
    const process = (res, index) => {
      result[index] = res
      count++
      if(count === promises.length) {
        resolve(result)
      }

    }
    promises.forEach((promise, index) => {
      if(promise && typeof promise.then === 'function') {
        promise.then(res => {
          process(res, index)
        }, reject)
      } else {
        process(promise, index)
      }
    })
  })
}

// 多维数组拍平并且获取最大深度
function flatten(arr) {
  let result = []
  let maxDepth = 1
  function flat(arr, depth) {
    arr.forEach(item => {
      if(Array.isArray(item)) {
        flat(item, depth+1)
      } else {
        result.push(item)
      }
    })
    maxDepth = Math.max(maxDepth, depth)
  }
  flat(arr, 1)
  return {result, maxDepth}
}

Function.prototype.bind = function(context = window, ...args) {
  const self = this

  const fn = function F(...rest) {
    const params = [...args, ...rest]
    self.apply(
      this instanceof F ? this : context,
      params
    )
  }

  fn.prototype = Object.create(self.prototype)

  return fn
}

async function multiRequest(urls, maxNum) {
  const tasks = []
  const doingTasks = []

  for(let i = 0; i < urls.length; i++) {
    const task = fetch(urls[i])
    tasks[i] = task

    const doing = task.finally(() => {
      doingTasks.splice(doingTasks.indexOf(doing), 1)
    })
    doingTasks.push(doing)

    if(doingTasks.length >= maxNum) {
      await Promise.race(doingTasks)
    }
  }



  return Promise.all(tasks)
}

//给出一个二叉树,用一个函数确定是否有一条从根节点到叶子节点的路径，这个路径上所有节点的值加在一起等于给定的sum的值
function hasPathSum(root, sum) {
  if(!root) return false
  if(!root.left && !root.right) {
    return root.val === sum
  }
  return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val)
}

function co(gen) {
  return (...args) => {
    const genFn = gen.apply(this, ...args)
    return new Promise((resolve, reject) => {
      const step = (key, data) => {
        let result
        try{
          result = genFn[key](data)
        } catch(err) {
          return reject(err)
        }
        const {value, done} = result
        if(done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then(res => {
            step('next', res)
          }, (err) => {
            step('throw', err)
          })
        }
      }
      step('next')
    })
  }

}
