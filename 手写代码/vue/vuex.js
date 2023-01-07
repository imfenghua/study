// vuex === {store, install}

class Store {
  constructor(option) {
    const { state, mutations, getter, actions} = option

    this._vm = new Vue({
      data: {
        $$state: state
      }
    })

    this._action = actions
    this._mutation = mutations

    this.commit = this.commit.bind(this)
    this.dispatch = thi.dispatch.bind(this)
  }

  get state() {
    return this._vm.data.$$state
  }

  set state(val) {
    throw error('不能直接修改')
  }

  dispatch(type, payload) {
    const fn = this._action[type]
    fn && fn(this, payload)
  }

  commit(type, payload) {
    const fn = this._mutation[type]
    fn && fn(this.state, payload)
  }
}

function install(_vue) {
  let vue = _vue
  vue.mixin({
    beforeCreate() {
      vue.prototype.$store = this.$options.store
    }
  })
}