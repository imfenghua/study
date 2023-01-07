class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(type, callback) {
    if(this.events[type]) {
      this.events[type].push(callback)
    } else {
      this.events[type] = [callback]
    }
  }

  off(type, callback) {
    if(this.events[type]) {
      this.events[type].filter(cb => cb !== callback && cb.l !== callback)
    }
  }

  emit(type, ...args) {
    cbs = this.events[type] || []
    cbs.forEach(cb => {
      cb(...args)
    });
  }

  // 利用on,off两个方法解决
  once(type, callback) {
    var one = (...args) => {
      callback(...args)
      this.off(type, one)
    }
    // 自定义属性
    one.l = callback
    this.on(type, one)
  }
}