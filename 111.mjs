async function parallelLimit(limit, params, fn) {
  var tasks = []
  var doingTasks = []

  for (let i = 0; i < params.length; i++) {
    const task = Promise.resolve().then(() => {
      return fn(params[i])
    })
    tasks.push(task)

    var doingTask = task.then(() => {
      doingTasks.splice(doingTasks.indexOf(doingTask), 1)
      // console.log('do task')
      // doingTasks.shift()
    })
    doingTasks.push(doingTask)

    if (doingTasks.length >= limit) {
      console.log(doingTasks)
      await Promise.race(doingTasks)
      console.log('after race')
    }
  }

  return Promise.all(tasks)
}

function serialRequest(params, fn) {
  var task = (param) => {
    return new Promise((resolve, rej) => {
      var result = fn(param)
      result && result.then ? result.then(resolve, rej) : resolve(result)
    })
  }

  return params.reduce((pre, cur) => {
    return pre.then(() => {
       return task(cur)
    })
  }, Promise.resolve())
}

const test = (param) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('当前参数为', param)
      res(param)
    }, 2000)
  })
}

// serialRequest([1, 2, 3, 4, 5, 6, 7, 8], test).then((res) => {
//   console.log('res', res)
// })

import assert from 'assert'
import { describe, it } from 'node:test'

describe('test case 1', () => {
  it('is num', async () => {
    const result = await serialRequest([1, 2, 666], test)

    assert.deepEqual(result, 666)
  })

  // it('2', )
})