class VueRouter {
  constructor(options) {
    this.$options = options
    this.routeMap = {}
    this.init()
  }

  init() {
    const { routes } = this.$option
    routes.forEach(route => {
      this.routeMap[route.path] = route
    });

    Vue.util.defineReactive(this, 'current')

    window.addEventListener('hashchange', this.onhashChange.bind(this))
    window.addEventListener('load', this.onhashChange.bind(this))
  }

  onhashChange() {
    this.current = window.location.hash.slice(1) || '/'
  }
}

VueRouter.install = function(_Vue) {
  let vue = _Vue

  vue.mixin({
    beforeCreate() {
      if(this.$options.router) {
        vue.prototype.$router = this.$options.router
      }
    }
  })

  vue.component('router-link', {
    props: {
      to: String
    },
    render(h) {
      return h('a', {
        attrs: {
          href: '#' + this.to
        }
      }, this.$slots.default)
    }
  })

  vue.component('router-view', {
    render(h) {
      const { routeMap, current } = this.$router
      const component = routeMap[current].component
      return h(component)
    }
  })
}