callbacks = []
pending = false

function nextTick(cb) {
  callbacks.push(cb)

  if(!pending) {
    pending = true
    setTimeout(flushCallbacks, 0);
  }
}


function flushCallbacks() {
  pending = false
  var cbs = [...callbacks]
  callbacks.length = 0
  for(var i = 0; i < cbs.length; i++) {
    cbs[i]()
  }
}

let uid = 0

class Watch {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    this.id = ++uid
    Dep.target = this
    this.oldValue = this.vm[key]
    Dep.target = null
  }


  update() {
    console.log('update')
    queueWatcher(this)
  }

  run() {
    console.log('最终会调用的是run方法')
    let newValue = this.vm[this.key]
    if(this.oldValue === newValue) return
    this.cb(newValue)
  }
}

let has = {}
let queue = []
let waiting = false

function queueWatcher(watcher) {
  if(!has[watcher.id]) {
    has[watcher.id] = true
    queue.push(watcher)
    if(!waiting) {
      waiting = true
      nextTick(flushQueueWatcher)
    }
  }
}

function flushQueueWatcher() {
  let watcher, id
  for(var i = 0;i < queue.length;i++) {
    watcher = queue[i]
    id = watcher.id
    has[id] = false
    watcher.run()

  }
}