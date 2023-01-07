function createStore(reducers, initialState) {
  if(typeof reducers !== 'function') {
    throw new Error('reducer must be a function')
  }
  let currentState = initialState
  let currentReducers = reducers
  let listeners = []
  let isDispatching = false

  function getState() {
    return currentState
  }

  function subscribe(listener) {
    listeners.push(listener)
    var isSubscribe = true

    return function unsubscribe() {
      if(!isSubscribe) return
      var index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    if(typeof action !== 'object' || action.type === undefined) {
      throw new Error('error')
    }

    if(isDispatching) {
      throw new Error('error')
    }

    try {
      isDispatching = true
      currentState = currentReducers(currentState, action)
    } finally {
      isDispatching = false
    }
    listeners.slice().forEach(listener => listener())
    return action
  }

  function replaceReducer(nextReducer) {
    currentReducers = nextReducer
    dispatch({
      type: 'actionType.init'
    })
  }

  dispatch({
    type: 'actionType.init'
  })

  return {
    dispatch,
    getState,
    subscribe,
    replaceReducer
  }
}

// combineReducer({
//   todo: TODOReducer
// })
function combineReducer(reducerMap) {
  let finalReducerMap = {}
  let defaultState = store.getState()
  for(let key in reducerMap) {
    if(typeof reducerMap[key] === 'function') {
      finalReducerMap[key] = reducerMap[key]
      defaultState[key] = reducerMap[key](defaultState, {type: 'actionType.init'})
    }
  }
  return function(state = defaultState, action) {
    let hasChange = false
    let finalState = {}
    for(let key in finalReducerMap) {
      let preState = state[key]
      let nextState = finalReducerMap[key](state, action)
      hasChange = hasChange || preState !== nextState
      finalState[key] = nextState
    }
    return hasChange ? finalState : state
  }
}

// 假设 actionCreators === {addTodo: addTodo, removeTodo: removeTodo}
// 简单的来说 bindActionCreators(actionCreators, dispatch)
// 最后返回的是:
// {
//   addTodo: function(text){
//      dispatch( actionCreators.addTodo(text) );
//   },
//   removeTodo: function(text){
//      dispatch( actionCreators.removeTodo(text) );
//   }
// }
function bindActionCreators(actionCreators, dispatch) {
  let res = {}
  for(let key in actionCreators) {
    if(typeof actionCreators[key] === 'function') {
      res[key] = (...args) => dispatch(actionCreators[key](...args))
    }
  }
  return res
}

function compose(...args) {
  return args.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState)
    const chain = []
    let dispatch = store.dispatch

    const middlewareParam = {
      getState: store.getState,
      dispatch
    }

    // 数组中每个元素的格式是：(next) => (action) => { return next(action)},此处next就是dispatch
    chain = middlewares.map(middleware => middleware(middlewareParam))

    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

// 自定义中间件的格式
function myMiddleware({getState, dispatch}) {
  return function(next) {
    return (action) => {
      // do something
      return next(action)
    }
  }
}