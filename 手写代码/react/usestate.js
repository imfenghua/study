function App() {
  const [num, updateNum] = useState(0)

  return <p onClick = {()=> {
    updateNum(num => num+1)
    updateNum(num => num+1)
    updateNum(num => num+1)
  }}>
    {num}
  </p>
}

const fiber = {
  memoizedState: '保存对应的hook链表',
  stateNode: '保存对应的组件实例， 此处为App组件实例'
}
// 一个usestate对应一个hook
const hook = {
  queue: {
    pending: '保存对应的更新函数，此处为updateNum(num => num+1)'
  },
  // 保存hook对应的state
  memoizedState: initialState,
  // 与下一个Hook连接形成单向无环链表
  next: null
}
// 点击操作时， 调用dispatchAction函数
// queue.pending.next会始终指向第一个更新
function dispatchAction(queue, action) {
  const update = {
    action,
    next
  }

  if(queue.pending === null) {
    update.next = update
  } else {
    update.next = queue.pending.next
    queue.pending.next = update
  }

  queue.pending = update

  // 模拟React开始调度更新
  schedule();
}

var isMount = true
let workInProgressHook = null
function schedule() {
  workInProgressHook = fiber.memoizedState
  fiber.stateNode()
  isMount = false
}

function useState(initialState) {
  let hook

  if(isMount) {
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }

    if(!fiber.memoizedState) {
      fiber.memoizedState = hook
    } else {
      workInProgressHook.next = hook
    }
  } else {
    hook = workInProgressHook
  }
  workInProgressHook = workInProgressHook.next


  // 寻找到对应的hook,开始计算state
  var baseState = hook.memoizedState
  if(hook.queue.pending) {
    var firstUpdate = hook.queue.pending.next

    do{
      // todo: 根据优先级更新、批量更新
      baseState = firstUpdate.action(baseState)
      firstUpdate = firstUpdate.next
    } while (firstUpdate !== hook.queue.pending.next)
  }

  hook.queue.pending = null

  hook.memoizedState = baseState
  return [baseState, dispatchAction.bind(null, hook.queue)]
}