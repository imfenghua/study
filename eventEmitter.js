class EventEmitter {
  constructor() {
    this._events = {}
  }

  on(event, callback) {
    if(this._events[event]) {
      this._events[event].push(callback)
    } else {
      this._events[event] = [callback]
    }
  }

  emit(event, ...args) {
    if(this._events[event]) {
      var handlers = [...this._events[event]]
      handlers.forEach(callback => callback(...args))
    }
  }

  off(event, callback) {
    var callbacks = this._events[event] || []
    this._events[event] = callbacks.filter(cb => cb !== callback)
  }

  once(event, callback) {
    var one=(...args)=> {
      callback(...args)
      this.off(event, one)
    }
    this.on(event, one)
  }
}