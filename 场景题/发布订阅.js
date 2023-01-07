class Event {
  constructor() {
    this.events = {}
  }

  on(type, cb) {
    if(typeof cb !== 'function') {
      throw new Error('cb must be a function')
    }

    if(this.events[type] && !this.events[type].includes(cb)) {
      this.events[type].push(cb)
    } else {
      this.events[type] = [cb]
    }
  }

  off(type, cb) {
    if(!cb) {
      this.events[type] = []
      return
    }
    if(this.events[type]) {
      this.events[type] = this.events[type].filter(item => item !== cb)
    }
  }
  once(type, cb) {
    const self = this
    const one = (...args) => {
      cb.apply(this, args)
      self.off(type, one)
    }
    self.on(type, one)
  }

  emit(type, ...args) {
    if(this.events[type]) {
      const eventList = this.events[type].slice()
      eventList.forEach(item => item(...args))
    } else {
      throw new Error('no such event')
    }
  }
}