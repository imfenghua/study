function createRenderer(option) {
  const {createElement, setElementText, insert} = option

  function mountElement(vnode, container) {
    // 将vnode与真实dom建立联系
    const el = vnode.el = createElement(vnode.type)

    if(typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    } else if(Array.isArray(vnode.children)) {
      vnode.children.forEach(child => patch(null, child, el))
    }

    // const vnode = {
    //   type: 'div',
    //   props: {
    //     id:
    //   }
    // }
    // 处理props，优先考虑设置Dom properties, 再考虑设置setAttribute
    // 暂时不考虑el.key是只读的情况
    // 类似createElement, 保证通用性，需要将设置属性作为option 传进来
    for(const key in vnode.props) {
      patchProps(el, key, vnode.props[key])
    }

    insert(el, container)
  }


  function mountComponent(vnode, container, anchor) {
    const {
      data,
      props: propsOption,
      render,
      beforeCreate,
      created,
      beforeUpdate,
      updated,
      beforeMount,
      mounted,
      setup
    } = vnode.type

    beforeCreate && beforeCreate()

    const state = reactive(data())
    const [props, attrs] = resolveProps(propsOption, vnode.props)
    const instance = {
      state,
      props: shallowReactive(props),
      isMounted: false,
      subTree: null,
      slots
    }
    vnode.component = instance

    const emit = (event, ...payload) => {
      const eventName = `on${event[0].toUpperCase()}${event.slice(1)}`
      const handler = instance.props[eventName]
      if(handler) {
        handler(...payload)
      } else {
        console.log('事件不存在')
      }
    }

    const slots = vnode.children || {}

    //setup在此处执行
    const setupContext = {attrs, emit, slots}
    const setupResult = setup(shallowReadonly(instance.props), setupContext)
    let setupState = null
    if(typeof setupResult === 'function') {
      if(render) console.error('setup 函数返回渲染函数，render 选项将被忽略')
      render = setupResult
    } else {
      setupState = setupResult
    }

    const renderText = new Proxy(instance, {
      get(target, key, receiver) {
        const {state, props, slots} = target
        if(key === '$slots') return slots
        if(state && key in state) {
          return state[key]
        } else if(props && key in props) {
          return props[key]
        } else if(setupState && key in setupState) {
          return setupState[key]
        } else {
          console.log('not found')
        }
      },
      set(target, key, value, receiver) {
        const { state, props } = target
        if (state && key in state) {
          state[key] = v
        } else if (key in props) {
          props[key] = v
        } else if (setupState && key in setupState) {
          setupState[key] = v
        } else {
          console.error('不存在')
        }
      }
    })

    created && created.call(renderText)

    effect(()=>{
      // render 函数中从this读取某个属性时，会从渲染上下文中寻找。渲染上下文会优先寻找state， 其次再去props中寻找,再去setup返回中寻找
      const subTree = render.call(renderText, renderText)
      if(!instance.isMounted) {
        beforeMount && beforeMount()
        patch(null, subTree, container, anchor)
        instance.isMounted = true
        mounted && mounted()
      } else {
        beforeUpdate && beforeUpdate()
        patch(instance.subTree, subTree, container, anchor)
        updated && updated()
      }
      instance.subTree = subTree
    }, {
      scheduler: queueJob
    })

  }

  let queue = new Set()
  let isflushing = false
  function queueJob(effectFn) {
    queue.add(effectFn)

    if(!isflushing) {
      isflushing = true
      Promise.resolve().then(()=> {
        queue.forEach(job => job())
      }).catch(err=> {
        isflushing = false
        queue.length = 0
      })
    }
  }

  function unmount(vnode) {
    if(vnode.type === Fragment) {
      vnode.children.forEach((child => unmount(child)))
      return
    }
    const parent = vnode.el.parent
    if(parent) {
      parent.removeChild(vnode.el)
    }
  }

  function patchProps(el, key, preValue, nextValue) {
    // 一个元素可能绑定多种类型事件
    // 一个元素一个事件可能有多个处理函数
    // const vnode = {
    //   type: 'p',
    //   props: {
    //     onClick: [
    //       () => {
    //         alert('clicked 1')
    //       },
    //       () => {
    //         alert('clicked 2')
    //       }
    //     ]
    //   },
    //   children: 'text'
    // }
    if(/^on/.test(key)) {
      const invokers = el._vei || (el._vei = {})
      const name = key.slice(2).toLowerCase()
      const invoker = invokers[key]

      if(nextValue) {
        if(!invoker) {
          invoker = el._vei[key] = (e) => {
            //如果事件发生的时间早于事件处理函数绑定的事件，则不执行事件处理函数
            if(e.timeStamp < invoker.attached) return
            if(Array.isArray(invoker.value)) {
              invoker.value.forEach(fn=> fn(e))
            } else {
              invoker.value(e)
            }
          }
          invoker.value = nextValue
          invoker.attached = performance.now()
          el.addEvenetListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if(invoker) {
        el.removeEventListener(name, invoker)
      }
    }else if(key === 'class') {
      // 因为classname这种设置方式相比setAttribute和el.classList来说性能最好
      el.className = vnode.props[key]
    }else if(key in el ) {
      const type = typeof el[key]
      const value = el[key]
      if(type === 'boolean' && value === '') {
        el[key] = true
      } else {
        el[key] = value
      }
    } else {
      el.setAttribute(key, vnode.props[key])
    }
  }

  function patchElement(n1, n2) {
    const el = n2.el = n1.el
    const oldProps = n1.props
    const newProps = n2.props

    // 第一步： 更新props
    for(const key in newProps) {
      if(newProps[key] !== oldProps) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }

    // 第二步： 更新子节点
    // 新旧子节点都有三种情况： 1. 没有子节点 2. 有文本节点 3. 有多个子节点
    patchChild(n1, n2, el)
  }

  function patchChild(n1, n2, container) {
    if(typeof n2.children === 'string') {
      if(Array.isArray(n1.children)) {
        n1.children.forEach((child) => {
          unmount(child)
        })
      }
      setElementText(container, n2.children)
    } else if(Array.isArray(n2.children)) {
      if(Array.isArray(n1.children)) {
        // diff算法
        // vue2使用 双端diff, vue3使用快速diff
        // 此处写的是快速diff
        fastDiff(n1, n2, container)
      } else {
        setElementText(container, '')
        n2.children.forEach(child => patch(null, child, container))
      }
    } else {
      if(Array.isArray(n1.children)) {
        n1.children.forEach((child) => {
          unmount(child)
        })
      } else if(typeof n1.children === 'string') {
        setElementText(container, '')
      }

    }
  }

  // 挂载和更新均执行这个函数
  // n1为空表示挂载，其他表示更新
  function patch(n1, n2, container, anchor) {
    if(n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }

    // string：简单节点
    // TEXT：文本节点const Text = Symbol()
    // COMMENT： 注释节点const Comment = Symbol()
    // object： 组件节点

    const { type } = n2

    if( type === 'string') {
      if(!n1) {
        mountElement(n2, container)
      } else {
        patchElement(n1, n2)
      }
    } else if(type === Text) {
      if(!n1) {
        const el = n2.el = document.createTextNode(n2.children)
        insert(el,container)
      } else {
        const el = n2.el = n1.el
        if (n2.children !== n1.children) {
          el.nodeValue = n2.children
        }
      }
    } else if(type === Comment) {
      if(!n1) {
        const el = n2.el = document.createComment(n2.children)
        insert(el,container)
      } else {
        const el = n2.el = n1.el
        if (n2.children !== n1.children) {
          el.nodeValue = n2.children
        }
      }
    } else if(type === Fragment) {
      if(!n1) {
        n2.children.forEach(child => patch(null, child, container))
      } else {
        patchChild(n1, n2, container)
      }
    } else if(typeof type === 'object') {
      if(!n1) {
        mountComponent(n2, container, anchor)
      } else {
        patchComponent(n1, n2, anchor)
      }
    }

  }

  function render(vnode, container) {
    if(vnode) {
      patch(container._vnode, vnode, container)
    } else {
      if(container._vnode) {
        unmount(container._vnode)
      }
    }
    container._vnode = vnode
  }

  return {
    render
  }
}

function fastDiff(n1, n2, container) {
  const oldChildren = n1.children
  const newChildren = n2. children

  let j = 0
  let oldNode = oldChildren[j]
  let newNode = newChildren[j]
  while(oldNode.key === newNode.key) {
    patch(oldNode, newNode, container)
    j++
    oldNode = oldChildren[j]
    newNode = newChildren[j]
  }

  let newEndIndex = newChildren.length - 1
  let oldEndIndex = oldChildren.length-1
  while(newChildren[newEndIndex].key === oldChildren[oldEndIndex].key) {
    patch(oldChildren[oldEndIndex], newChildren[newEndIndex], container)
    newEndIndex--
    oldEndIndex--
  }

  if(j <= newEndIndex && j > oldEndIndex) {
    const anchorIndex = newEndIndex + 1
    for(let i = j; i <= newEndIndex; i++) {
      patch(null, newChildren[i], container, newChildren[anchorIndex].el)
    }
  } else if(j> newEndIndex && j<=oldEndIndex) {
    while(j <= oldEndIndex) {
      unmount(oldChildren[j++])
    }
  } else {
    let newStartIndex = j
    let oldStartIndex = j
    let count = newEndIndex - newStartIndex +1
    let source = new Array(count).fill(-1)
    let newKeyIndexMap = {}
    let pos = 0
    let moved = false
    let patched = 0
    for(let i = newStartIndex; i <= newEndIndex; i++) {
      newKeyIndexMap[newChildren[i].key] = i
    }

    for(let i = oldStartIndex; i <= oldEndIndex;i++) {
      const oldChild = oldChildren[i]
      if(patched <= count) {
        const key = oldChild.key
        const newIndex = newKeyIndexMap[key]
        if(newIndex) {
          patch(oldChild, newChildren[newIndex], container)
          source[newKeyIndexMap[key]-newStartIndex] = i
          patched ++
          if(newIndex < pos) {
            moved = true
          } else {
            pos = newIndex
          }
        } else {
          unmount(oldChild)
        }
      } else {
        unmount(oldChild)
      }

    }

    if(moved) {
      const seq = getSequence[source]
      let s = seq.length -1
      let i = source.length -1

      while(i>=0) {
        if(source[i] === -1) {
          const pos = i+newStartIndex
          const newChild = newChildren[pos]
          const anchorIndex = pos+1
          const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
          patch(null, newChild,container, anchor)
        } else if(seq[s] !== i) {
          // 需要移动
          const pos = i+newStartIndex
          const newChild = newChildren[pos]
          const anchorIndex = pos+1
          const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
          insert(newChild, container, anchor)
        } else {
          s--
        }
        i--
      }
    }
  }


}