class Vue {
  constructor(options = {}) {
    const {el, data = {}} = options
    this.$options = options
    this.$el = typeof el === 'string' ? document.querySelector(el) : el
    this.$data = data
    this._proxy(this.$data) // data属性挂载到vue实例
    new Observer(this.$data)
    new Complier(this)
  }

  _proxy(data) {
    Object.keys(data). forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          if(data[key] === newVal) return
          data[key] = newVal
        }
      })
    })
  }
}

class Observer {
  constructor(data) {
    this.reactive(data)
  }

  reactive(data) {
    if(typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        var dep = new Dep()
        Object.defineProperty(data, key, {
          get() {
            Dep.target && dep.addSub(Dep.target)
            return val
          },
          set(newVal) {
            if(val === newVal) return
            val = newVal
            dep.notify()
          }
        })
        this.reactive(data[key])
      })
    }
  }
}

class Dep {
  constructor() {
    this.subs = []
  }

  addSub(watcher) {
    if(watcher && watcher.update) {
      this.subs.push(watcher)
    }
  }

  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

class Watch {
  constructor(vm, key, cb) {
    this.vm = vm
    this.cb = cb
    this.key = key
    Dep.target = this
    this.oldValue = this.vm[key]
    Dep.target = null
  }

  update() {
    let newValue = this.vm[this.key]
    if(this.oldValue === newValue) return
    this.cb(newValue)
  }
}

class Complier {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.complie(this.el)
  }

  complie(node) {
    var childNodes = node.childNodes()
    Array.from(childNodes).forEach(child => {
      // 根据child.nodeType判断节点类型 1：元素节点 3：文本节点
      // 处理文本节点
      if (this.isTextNode(child)) {
        this.compileText(child)
      } else if (this.isElementNode(child)) {
        // 处理元素节点....
        this.compileElement(child)
      }

      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (child.childNodes && child.childNodes.length) {
        this.compile(child)
      }
    })
  }

  compileText(node) {
    const key = 'getKey'
    new Watch(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
}