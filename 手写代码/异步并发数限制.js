async function parallelLimit(limit, params, fn) {
  var tasks = []
  var doingTasks = []

  for (var i = 0; i < params.length; i++) {
    var task = Promise.resolve().then(() => {
      fn([arams[i]])
    })
    // 如果要按顺序的话，使用task[index] = task
    tasks.push(task)

    var doingTask = task.then(() => {
      doingTasks.splice(doingTasks.indexOf(doingTask), 1)
    })
    doingTasks.push(doingTask)

    if (doingTasks.length >= limit) {
      await Promise.race(doingTasks)
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

var test = (param) => {
  setTimeout(() => {
    console.log('当前参数为', param)
  }, 1000)
}


// 顺序发送四个请求， 要求按照顺序输出
const serialRequest = (urls) => {
  let result = [];
  return urls.reduce((pre, cur) => {
    return pre.then(() => {
      return fetch(cur).then(res => {
        result.push(res);
      }).catch(err => {
        result.push(err);
      })
    })
  }, Promise.resolve()).then(() => {
    return result;
  })
}


