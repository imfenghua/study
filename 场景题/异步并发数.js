// 异步并发数
async function asyncParaller(fn, params, size) {
  const tasks = []
  const doingTasks = []

  for (let i = 0; i < params.length; i++) {
    const task = Promise.resolve().then(() => {
      fn(params[i])
    })
    tasks.push(task)

    const doingTask = task.then(() => {
      doingTasks.splice(doingTasks.indexOf(doingTask), 1)
    })
    doingTasks.push(doingTask)

    if(doingTasks.length >= size) {
      await Promise.race(doingTasks)
    }
  }

  return Promise.all(tasks)
}